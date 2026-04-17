import { describe, it, expect } from 'vitest';
import { RpcClient } from '../rpc-client.js';

const TESTNET_RPC = 'https://soroban-testnet.stellar.org';
const POOL_ADDRESS = 'CA2TZYEXHGWWJJYYETDQBAUNJF7F2J4GVLDLW6LM5W32IIT4AO5SMPWQ';

describe('RpcClient', () => {
  const client = new RpcClient({
    rpcUrl: TESTNET_RPC,
    networkPassphrase: 'Test SDF Network ; September 2015',
  });

  it('getLatestLedger returns a positive number', async () => {
    const ledger = await client.getLatestLedger();
    expect(ledger).toBeGreaterThan(0);
  });

  it('fetchPoolEvents returns commitments and nullifiers arrays', async () => {
    const latestLedger = await client.getLatestLedger();
    // Fetch from recent ledgers only (last ~1000)
    const startLedger = Math.max(1, latestLedger - 1000);
    const events = await client.fetchPoolEvents(POOL_ADDRESS, startLedger);

    expect(events).toHaveProperty('commitments');
    expect(events).toHaveProperty('nullifiers');
    expect(events).toHaveProperty('latestLedger');
    expect(Array.isArray(events.commitments)).toBe(true);
    expect(Array.isArray(events.nullifiers)).toBe(true);
    expect(events.latestLedger).toBeGreaterThan(0);
  });

  it('commitment events have correct shape', async () => {
    const latestLedger = await client.getLatestLedger();
    const startLedger = Math.max(1, latestLedger - 5000);
    const events = await client.fetchPoolEvents(POOL_ADDRESS, startLedger);

    if (events.commitments.length > 0) {
      const c = events.commitments[0];
      expect(typeof c.commitment).toBe('string');
      expect(c.commitment.startsWith('0x')).toBe(true);
      expect(typeof c.index).toBe('number');
      expect(c.encryptedOutput).toBeInstanceOf(Uint8Array);
      expect(typeof c.ledger).toBe('number');
    }
  });

  it('nullifier events have correct shape', async () => {
    const latestLedger = await client.getLatestLedger();
    const startLedger = Math.max(1, latestLedger - 5000);
    const events = await client.fetchPoolEvents(POOL_ADDRESS, startLedger);

    if (events.nullifiers.length > 0) {
      const n = events.nullifiers[0];
      expect(typeof n.nullifier).toBe('string');
      expect(n.nullifier.startsWith('0x')).toBe(true);
      expect(typeof n.ledger).toBe('number');
    }
  });
});
