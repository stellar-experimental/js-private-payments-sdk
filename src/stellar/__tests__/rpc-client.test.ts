import { describe, it, expect, beforeAll } from 'vitest';
import { RpcClient } from '../rpc-client.js';
import type { PoolEvents, ASPMembershipEvents } from '../../types.js';

const TESTNET_RPC = 'https://soroban-testnet.stellar.org';
const POOL_ADDRESS = 'CA2TZYEXHGWWJJYYETDQBAUNJF7F2J4GVLDLW6LM5W32IIT4AO5SMPWQ';
const ASP_MEMBERSHIP_ADDRESS = 'CAC7YUZGC65TXX4I6LGBUVGEZW767LAP5JVZT5O2I6DIA3NGL6WKQOGH';

describe('RpcClient', () => {
  const client = new RpcClient({
    rpcUrl: TESTNET_RPC,
    networkPassphrase: 'Test SDF Network ; September 2015',
  });

  let latestLedger: number;
  let poolEvents: PoolEvents;
  let aspEvents: ASPMembershipEvents;

  beforeAll(async () => {
    latestLedger = await client.getLatestLedger();
    const startLedger = Math.max(1, latestLedger - 5000);
    poolEvents = await client.fetchPoolEvents(POOL_ADDRESS, startLedger);
    aspEvents = await client.fetchASPMembershipEvents(ASP_MEMBERSHIP_ADDRESS, startLedger);
  });

  it('getLatestLedger returns a positive number', () => {
    expect(latestLedger).toBeGreaterThan(0);
  });

  it('fetchPoolEvents returns commitments and nullifiers arrays', () => {
    expect(Array.isArray(poolEvents.commitments)).toBe(true);
    expect(Array.isArray(poolEvents.nullifiers)).toBe(true);
    expect(poolEvents.latestLedger).toBeGreaterThan(0);
  });

  it('commitment events have correct shape', () => {
    if (poolEvents.commitments.length > 0) {
      const c = poolEvents.commitments[0];
      expect(typeof c.commitment).toBe('string');
      expect(c.commitment.startsWith('0x')).toBe(true);
      expect(typeof c.index).toBe('number');
      expect(c.encryptedOutput).toBeInstanceOf(Uint8Array);
      expect(typeof c.ledger).toBe('number');
    }
  });

  it('nullifier events have correct shape', () => {
    if (poolEvents.nullifiers.length > 0) {
      const n = poolEvents.nullifiers[0];
      expect(typeof n.nullifier).toBe('string');
      expect(n.nullifier.startsWith('0x')).toBe(true);
      expect(typeof n.ledger).toBe('number');
    }
  });

  it('fetchASPMembershipEvents returns leaves array', () => {
    expect(Array.isArray(aspEvents.leaves)).toBe(true);
    expect(aspEvents.latestLedger).toBeGreaterThan(0);
  });

  it('ASP membership events have correct shape', () => {
    if (aspEvents.leaves.length > 0) {
      const l = aspEvents.leaves[0];
      expect(typeof l.leaf).toBe('string');
      expect(l.leaf.startsWith('0x')).toBe(true);
      expect(typeof l.index).toBe('number');
      expect(typeof l.root).toBe('string');
      expect(l.root.startsWith('0x')).toBe(true);
      expect(typeof l.ledger).toBe('number');
    }
  });
});
