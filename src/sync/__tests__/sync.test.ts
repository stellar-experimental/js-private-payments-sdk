import { describe, it, expect, beforeAll } from 'vitest';
import { WasmBridge } from '../../wasm/bridge.js';
import { MemoryStorage } from '../../storage/memory.js';
import { PoolStore } from '../pool-store.js';
import { ASPMembershipStore } from '../asp-membership-store.js';
import { syncAll } from '../sync.js';
import type { RpcClient } from '../../stellar/rpc-client.js';
import type { PoolEvents, ASPMembershipEvents } from '../../types.js';

function fakeCommitment(index: number): string {
  return '0x' + (index + 1).toString(16).padStart(64, '0');
}

function createMockRpcClient(poolEvents: PoolEvents, aspEvents: ASPMembershipEvents): RpcClient {
  return {
    getLatestLedger: async () => 1000,
    fetchPoolEvents: async () => poolEvents,
    fetchASPMembershipEvents: async () => aspEvents,
  } as unknown as RpcClient;
}

describe('syncAll', () => {
  let bridge: WasmBridge;

  beforeAll(async () => {
    bridge = new WasmBridge();
    await bridge.initialize();
  });

  it('syncs pool and ASP events into stores', async () => {
    const storage = new MemoryStorage();
    await storage.init();
    const poolStore = new PoolStore(storage, bridge);
    const aspStore = new ASPMembershipStore(storage, bridge);

    const rpcClient = createMockRpcClient(
      {
        commitments: [
          { commitment: fakeCommitment(0), index: 0, encryptedOutput: new Uint8Array([1]), ledger: 100 },
          { commitment: fakeCommitment(1), index: 1, encryptedOutput: new Uint8Array([2]), ledger: 101 },
        ],
        nullifiers: [
          { nullifier: '0x' + 'aa'.repeat(32), ledger: 100 },
        ],
        latestLedger: 1000,
      },
      {
        leaves: [
          { leaf: fakeCommitment(0), index: 0, root: '0x' + 'ff'.repeat(32), ledger: 100 },
        ],
        latestLedger: 1000,
      },
    );

    const result = await syncAll(rpcClient, storage, poolStore, aspStore, 'POOL', 'ASP');

    expect(result.latestLedger).toBe(1000);
    expect(result.newCommitments).toBe(2);
    expect(result.newNullifiers).toBe(1);
    expect(result.newMembershipLeaves).toBe(1);
    expect(poolStore.getNextIndex()).toBe(2);
    expect(aspStore.getNextIndex()).toBe(1);
  });

  it('second sync starts from last synced ledger', async () => {
    const storage = new MemoryStorage();
    await storage.init();
    const poolStore = new PoolStore(storage, bridge);
    const aspStore = new ASPMembershipStore(storage, bridge);

    const emptyEvents: PoolEvents = { commitments: [], nullifiers: [], latestLedger: 1000 };
    const emptyAspEvents: ASPMembershipEvents = { leaves: [], latestLedger: 1000 };
    const rpcClient = createMockRpcClient(emptyEvents, emptyAspEvents);

    const first = await syncAll(rpcClient, storage, poolStore, aspStore, 'POOL', 'ASP');
    expect(first.lastSyncedLedger).toBe(1);

    const second = await syncAll(rpcClient, storage, poolStore, aspStore, 'POOL', 'ASP');
    expect(second.lastSyncedLedger).toBe(1000);
  });

  it('updates sync_metadata in storage', async () => {
    const storage = new MemoryStorage();
    await storage.init();
    const poolStore = new PoolStore(storage, bridge);
    const aspStore = new ASPMembershipStore(storage, bridge);

    const emptyEvents: PoolEvents = { commitments: [], nullifiers: [], latestLedger: 500 };
    const emptyAspEvents: ASPMembershipEvents = { leaves: [], latestLedger: 500 };
    const rpcClient = createMockRpcClient(emptyEvents, emptyAspEvents);

    await syncAll(rpcClient, storage, poolStore, aspStore, 'POOL', 'ASP');

    const metadata = await storage.get('sync_metadata', 'POOL');
    expect(metadata.lastSyncedLedger).toBe(500);
  });

  it('skips duplicate events on re-sync', async () => {
    const storage = new MemoryStorage();
    await storage.init();
    const poolStore = new PoolStore(storage, bridge);
    const aspStore = new ASPMembershipStore(storage, bridge);

    const poolEvents: PoolEvents = {
      commitments: [{ commitment: fakeCommitment(0), index: 0, encryptedOutput: new Uint8Array([1]), ledger: 100 }],
      nullifiers: [],
      latestLedger: 1000,
    };
    const aspEvents: ASPMembershipEvents = { leaves: [], latestLedger: 1000 };
    const rpcClient = createMockRpcClient(poolEvents, aspEvents);

    await syncAll(rpcClient, storage, poolStore, aspStore, 'POOL', 'ASP');
    const rootAfterFirst = poolStore.getRoot();

    // Sync again with same events — stores should skip duplicates
    await syncAll(rpcClient, storage, poolStore, aspStore, 'POOL', 'ASP');
    expect(poolStore.getRoot()).toEqual(rootAfterFirst);
    expect(poolStore.getNextIndex()).toBe(1);
  });
});
