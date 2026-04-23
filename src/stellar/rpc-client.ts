import { rpc, xdr, scValToNative } from '@stellar/stellar-sdk';
import type { PoolEvents, ASPMembershipEvents, CommitmentEvent, NullifierEvent, ASPMembershipEvent } from '../types.js';
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

  /**
   * Get the latest ledger sequence number from the network.
   * @returns Latest ledger sequence number
   */
  async getLatestLedger(): Promise<number> {
    const result = await this.server.getLatestLedger();
    return result.sequence;
  }

  /**
   * Fetch pool events (commitments, nullifiers) since a given ledger.
   * Handles chunked scanning and RPC retention window drift.
   * @param poolAddress - Pool contract address
   * @param startLedger - Ledger to start scanning from
   * @returns Parsed commitment and nullifier events ready for PoolStore
   * @throws {Error} If RPC request fails or event data is malformed
   */
  async fetchPoolEvents(poolAddress: string, startLedger: number): Promise<PoolEvents> {
    const commitments: CommitmentEvent[] = [];
    const nullifiers: NullifierEvent[] = [];

    const { latestLedger } = await this.fetchContractEvents(poolAddress, startLedger, (event) => {
      const eventType = event.topic?.[0];
      if (eventType === 'new_commitment_event' || eventType === 'NewCommitmentEvent') {
        const index = Number(event.value?.index);
        if (!Number.isFinite(index)) throw new Error('Invalid commitment event: missing or invalid index');
        commitments.push({
          commitment: normalizeU256(event.topic?.[1]),
          index,
          encryptedOutput: parseEncryptedOutput(event.value?.encrypted_output),
          ledger: event.ledger,
        });
      } else if (eventType === 'new_nullifier_event' || eventType === 'NewNullifierEvent') {
        nullifiers.push({
          nullifier: normalizeU256(event.topic?.[1]),
          ledger: event.ledger,
        });
      }
    });

    return { commitments, nullifiers, latestLedger };
  }

  /**
   * Fetch ASP membership events (leaf additions) since a given ledger.
   * Handles chunked scanning and RPC retention window drift.
   * @param aspAddress - ASP Membership contract address
   * @param startLedger - Ledger to start scanning from
   * @returns Parsed membership events ready for ASPMembershipStore
   * @throws {Error} If RPC request fails or event data is malformed
   */
  async fetchASPMembershipEvents(aspAddress: string, startLedger: number): Promise<ASPMembershipEvents> {
    const leaves: ASPMembershipEvent[] = [];

    const { latestLedger } = await this.fetchContractEvents(aspAddress, startLedger, (event) => {
      const eventType = event.topic?.[0];
      if (eventType === 'LeafAdded' || eventType === 'leaf_added') {
        const index = Number(event.value?.index);
        if (!Number.isFinite(index)) throw new Error('Invalid ASP membership event: missing or invalid index');
        leaves.push({
          leaf: normalizeU256(event.value?.leaf),
          index,
          root: normalizeU256(event.value?.root),
          ledger: event.ledger,
        });
      }
    });

    return { leaves, latestLedger };
  }

  private async fetchContractEvents(
    contractAddress: string,
    startLedger: number,
    onEvent: (event: ParsedEvent) => void,
  ): Promise<{ latestLedger: number }> {
    const latestLedger = await this.getLatestLedger();

    let currentStart = startLedger;
    while (currentStart <= latestLedger) {
      const currentEnd = Math.min(latestLedger, currentStart + CHUNK_SIZE - 1);
      let rawEvents: ParsedEvent[];
      try {
        rawEvents = await this.fetchEventsChunk(contractAddress, currentStart, currentEnd);
      } catch (err: any) {
        const rangeMatch = err.message?.match(/ledger range:\s*(\d+)\s*-\s*(\d+)/i);
        if (rangeMatch && /startledger must be within/i.test(err.message)) {
          const oldest = Number(rangeMatch[1]);
          if (Number.isFinite(oldest) && currentStart < oldest) {
            currentStart = oldest;
            continue;
          }
        }
        throw err;
      }

      for (const event of rawEvents) {
        onEvent(event);
      }

      currentStart = currentEnd + 1;
    }

    return { latestLedger };
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
        throw new Error(json.error.message || JSON.stringify(json.error));
      }

      const pageEvents = (json.result?.events || []).map((event: any) => ({
        ledger: event.ledger,
        topic: event.topic.map((t: string) => scValToNative(xdr.ScVal.fromXDR(t, 'base64'))),
        value: scValToNative(xdr.ScVal.fromXDR(event.value, 'base64')),
      }));

      allEvents.push(...pageEvents);

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
