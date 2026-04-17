import { describe, it, expect, beforeAll } from 'vitest';
import { RpcClient } from '../rpc-client.js';
import type { PoolEvents } from '../../types.js';

const TESTNET_RPC = 'https://soroban-testnet.stellar.org';
const POOL_ADDRESS = 'CA2TZYEXHGWWJJYYETDQBAUNJF7F2J4GVLDLW6LM5W32IIT4AO5SMPWQ';

describe('RpcClient', () => {
  const client = new RpcClient({
    rpcUrl: TESTNET_RPC,
    networkPassphrase: 'Test SDF Network ; September 2015',
  });

  let latestLedger: number;
  let events: PoolEvents;

  beforeAll(async () => {
    latestLedger = await client.getLatestLedger();
    const startLedger = Math.max(1, latestLedger - 5000);
    events = await client.fetchPoolEvents(POOL_ADDRESS, startLedger);
  });

  it('getLatestLedger returns a positive number', () => {
    expect(latestLedger).toBeGreaterThan(0);
  });

  it('fetchPoolEvents returns commitments and nullifiers arrays', () => {
    expect(Array.isArray(events.commitments)).toBe(true);
    expect(Array.isArray(events.nullifiers)).toBe(true);
    expect(events.latestLedger).toBeGreaterThan(0);
  });

  it('commitment events have correct shape', () => {
    if (events.commitments.length > 0) {
      const c = events.commitments[0];
      expect(typeof c.commitment).toBe('string');
      expect(c.commitment.startsWith('0x')).toBe(true);
      expect(typeof c.index).toBe('number');
      expect(c.encryptedOutput).toBeInstanceOf(Uint8Array);
      expect(typeof c.ledger).toBe('number');
    }
  });

  it('nullifier events have correct shape', () => {
    if (events.nullifiers.length > 0) {
      const n = events.nullifiers[0];
      expect(typeof n.nullifier).toBe('string');
      expect(n.nullifier.startsWith('0x')).toBe(true);
      expect(typeof n.ledger).toBe('number');
    }
  });
});
