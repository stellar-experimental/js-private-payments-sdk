import { rpc, xdr, scValToNative } from '@stellar/stellar-sdk';
import type { PoolEvents } from '../types.js';
import { hexToBytes, normalizeU256 } from '../utils.js';

export interface RpcClientConfig {
  rpcUrl: string;
  networkPassphrase: string;
}

const CHUNK_SIZE = 5000;
const PAGE_SIZE = 100;

export class RpcClient {
  private server: rpc.Server;

  constructor(private config: RpcClientConfig) {
    this.server = new rpc.Server(config.rpcUrl);
  }

  async getLatestLedger(): Promise<number> {
    const result = await this.server.getLatestLedger();
    return result.sequence;
  }

  async fetchPoolEvents(poolAddress: string, startLedger: number): Promise<PoolEvents> {
    const latestLedger = await this.getLatestLedger();
    const result: PoolEvents = { commitments: [], nullifiers: [], latestLedger };

    let currentStart = startLedger;
    while (currentStart <= latestLedger) {
      const currentEnd = Math.min(latestLedger, currentStart + CHUNK_SIZE - 1);
      const rawEvents = await this.fetchEventsChunk(poolAddress, currentStart, currentEnd);

      for (const event of rawEvents) {
        const eventType = event.topic?.[0];
        if (eventType === 'new_commitment_event' || eventType === 'NewCommitmentEvent') {
          const index = Number(event.value?.index);
          if (!Number.isFinite(index)) throw new Error(`Invalid commitment event: missing or invalid index`);
          result.commitments.push({
            commitment: normalizeU256(event.topic?.[1]),
            index,
            encryptedOutput: parseEncryptedOutput(event.value?.encrypted_output),
            ledger: event.ledger,
          });
        } else if (eventType === 'new_nullifier_event' || eventType === 'NewNullifierEvent') {
          result.nullifiers.push({
            nullifier: normalizeU256(event.topic?.[1]),
            ledger: event.ledger,
          });
        }
      }

      currentStart = currentEnd + 1;
    }

    return result;
  }

  private async fetchEventsChunk(contractId: string, startLedger: number, endLedger: number): Promise<ParsedEvent[]> {
    const allEvents: ParsedEvent[] = [];
    let cursor: string | undefined;

    while (true) {
      const params: any = {
        ...(!cursor && { startLedger }),
        endLedger,
        filters: [{ contractIds: [contractId] }],
        pagination: { limit: PAGE_SIZE, ...(cursor && { cursor }) },
      };

      const response = await fetch(this.config.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method: 'getEvents', params }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`RPC request failed: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
      }

      const json = await response.json();
      if (json.error) {
        const message = json.error.message || JSON.stringify(json.error);
        // Handle retention window drift: if startLedger is before RPC's oldest, retry from oldest
        const rangeMatch = message.match(/ledger range:\s*(\d+)\s*-\s*(\d+)/i);
        if (rangeMatch && /startledger must be within/i.test(message)) {
          const oldest = Number(rangeMatch[1]);
          if (Number.isFinite(oldest) && startLedger < oldest) {
            return this.fetchEventsChunk(contractId, oldest, endLedger);
          }
        }
        throw new Error(message);
      }

      const pageEvents = (json.result?.events || []).map((event: any) => ({
        ledger: event.ledger,
        topic: event.topic.map((t: string) => scValToNative(xdr.ScVal.fromXDR(t, 'base64'))),
        value: scValToNative(xdr.ScVal.fromXDR(event.value, 'base64')),
      }));

      allEvents.push(...pageEvents);

      // If we got fewer than PAGE_SIZE, this chunk is done
      if (pageEvents.length < PAGE_SIZE) break;

      cursor = json.result?.cursor;
      if (!cursor) break;
    }

    return allEvents;
  }
}

interface ParsedEvent {
  ledger: number;
  topic: any[];
  value: any;
}

function parseEncryptedOutput(value: any): Uint8Array {
  if (value instanceof Uint8Array) return value;
  if (typeof value === 'string') return hexToBytes(value);
  if (Buffer.isBuffer(value)) return new Uint8Array(value);
  throw new Error(`Unexpected encrypted output type: ${typeof value}`);
}
