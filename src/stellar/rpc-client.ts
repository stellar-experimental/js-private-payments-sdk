import { rpc, xdr, scValToNative, contract, XdrLargeInt } from '@stellar/stellar-sdk';
import type { Signer } from '../signer/signer.js';
import type { PoolEvents, ASPMembershipEvents, CommitmentEvent, NullifierEvent, ASPMembershipEvent } from '../types.js';
import { hexToBytes, normalizeU256, bytesToBigIntBE } from '../utils.js';

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

  /**
   * Submit a pool transact() call with proof and ext data.
   * Builds the contract call, signs via the signer, submits, and waits up to 30s for confirmation.
   * @returns Transaction hash and ledger. Ledger is 0 if confirmation timed out (tx may still succeed).
   * @throws {Error} If proof is invalid, signing fails, or transaction is rejected on-chain
   */
  async submitTransaction(params: {
    poolContractAddress: string;
    signer: Signer;
    proof: Uint8Array;
    publicInputs: Uint8Array;
    extData: { recipient: string; ext_amount: bigint; encrypted_output0: Uint8Array; encrypted_output1: Uint8Array };
  }): Promise<{ txHash: string; ledger: number }> {
    const { poolContractAddress, signer, proof, publicInputs, extData } = params;
    if (proof.length !== 256) throw new Error(`Invalid proof: expected 256 bytes, got ${proof.length}`);
    if (publicInputs.length < 288) throw new Error(`Invalid publicInputs: expected at least 288 bytes (9 fields × 32), got ${publicInputs.length}`);

    const address = await signer.getPublicKey();

    // Parse public inputs (9 field elements × 32 bytes each = 288 bytes)
    // Order: root, publicAmount, extDataHash, aspMembershipRoot, aspNonMembershipRoot, nullifier0, nullifier1, commitment0, commitment1
    const fieldSize = 32;
    const parseField = (offset: number) => bytesToBigIntBE(publicInputs.slice(offset, offset + fieldSize));
    const poolRoot = parseField(0);
    const publicAmount = parseField(fieldSize);
    const extDataHash = publicInputs.slice(fieldSize * 2, fieldSize * 3);
    const aspMembershipRoot = parseField(fieldSize * 3);
    const aspNonMembershipRoot = parseField(fieldSize * 4);
    const nullifier0 = parseField(fieldSize * 5);
    const nullifier1 = parseField(fieldSize * 6);
    const commitment0 = parseField(fieldSize * 7);
    const commitment1 = parseField(fieldSize * 8);

    const contractProof = {
      proof: {
        a: proof.slice(0, 64),
        b: proof.slice(64, 192),
        c: proof.slice(192, 256),
      },
      root: poolRoot,
      input_nullifiers: [nullifier0, nullifier1],
      output_commitment0: commitment0,
      output_commitment1: commitment1,
      public_amount: publicAmount,
      ext_data_hash: extDataHash,
      asp_membership_root: aspMembershipRoot,
      asp_non_membership_root: aspNonMembershipRoot,
    };

    const contractExtData = {
      encrypted_output0: extData.encrypted_output0,
      encrypted_output1: extData.encrypted_output1,
      ext_amount: new XdrLargeInt('i256', extData.ext_amount.toString()).toScVal(),
      recipient: extData.recipient,
    };

    // Build contract client with signer callbacks
    const client = await contract.Client.from({
      rpcUrl: this.config.rpcUrl,
      networkPassphrase: this.config.networkPassphrase,
      publicKey: address,
      contractId: poolContractAddress,
      signTransaction: (txXdr: string) =>
        signer.signTransaction(txXdr, { networkPassphrase: this.config.networkPassphrase }),
      signAuthEntry: (entryXdr: string) =>
        signer.signAuthEntry(entryXdr, { networkPassphrase: this.config.networkPassphrase }),
    });

    // transact() is a pool-specific method discovered from the contract's ABI at runtime
    const tx = await (client as any).transact({
      proof: contractProof,
      ext_data: contractExtData,
      sender: address,
    });

    const sent = await tx.signAndSend();
    const txHash = sent?.sendTransactionResponse?.hash ?? sent?.hash ?? null;
    if (!txHash) throw new Error('Transaction submission failed: no hash returned');

    // Wait for confirmation
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const res = await this.server.getTransaction(txHash);
      if (res?.status === 'SUCCESS') {
        return { txHash, ledger: res.ledger };
      }
      if (res?.status === 'FAILED') {
        throw new Error(`Transaction failed: ${res?.resultXdr ?? 'unknown error'}`);
      }
    }

    // Timed out — tx was submitted but not yet confirmed. ledger: 0 indicates unconfirmed.
    return { txHash, ledger: 0 };
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
