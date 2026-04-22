import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { WasmBridge } from '../../wasm/bridge.js';
import { MemoryStorage } from '../../storage/memory.js';
import { PoolStore } from '../pool-store.js';
import type { CommitmentEvent, NullifierEvent } from '../../types.js';

function fakeCommitment(index: number): string {
  return '0x' + index.toString(16).padStart(64, '0');
}

function fakeEvent(index: number, ledger: number = 100): CommitmentEvent {
  return {
    commitment: fakeCommitment(index),
    index,
    encryptedOutput: new Uint8Array([index]),
    ledger,
  };
}

describe('PoolStore', () => {
  let bridge: WasmBridge;
  let storage: MemoryStorage;
  let poolStore: PoolStore;

  beforeAll(async () => {
    bridge = new WasmBridge();
    await bridge.initialize();
  });

  beforeEach(async () => {
    storage = new MemoryStorage();
    await storage.init();
    poolStore = new PoolStore(storage, bridge);
  });

  it('rebuildTree creates empty tree', async () => {
    await poolStore.rebuildTree();
    const root = poolStore.getRoot();
    expect(root).toBeInstanceOf(Uint8Array);
    expect(root.length).toBe(32);
  });

  it('processCommitmentEvents inserts leaves and updates tree', async () => {
    await poolStore.rebuildTree();
    const rootBefore = poolStore.getRoot();

    await poolStore.processCommitmentEvents([fakeEvent(0), fakeEvent(1)]);

    const rootAfter = poolStore.getRoot();
    expect(rootAfter).not.toEqual(rootBefore);
    expect(poolStore.getNextIndex()).toBe(2);
  });

  it('processCommitmentEvents stores leaves in storage', async () => {
    await poolStore.processCommitmentEvents([fakeEvent(0)]);

    const leaf = await storage.get('pool_leaves', 0);
    expect(leaf).toBeDefined();
    expect(leaf.commitment).toBe(fakeCommitment(0));
  });

  it('processCommitmentEvents stores encrypted outputs', async () => {
    await poolStore.processCommitmentEvents([fakeEvent(0)]);

    const output = await storage.get('pool_encrypted_outputs', fakeCommitment(0));
    expect(output).toBeDefined();
    expect(output.index).toBe(0);
  });

  it('rebuildTree restores from storage', async () => {
    await poolStore.processCommitmentEvents([fakeEvent(0), fakeEvent(1)]);
    const rootAfterInsert = poolStore.getRoot();

    // Create new PoolStore with same storage
    const newPoolStore = new PoolStore(storage, bridge);
    await newPoolStore.rebuildTree();

    expect(newPoolStore.getRoot()).toEqual(rootAfterInsert);
    expect(newPoolStore.getNextIndex()).toBe(2);
  });

  it('getProof returns valid proof for inserted leaf', async () => {
    await poolStore.processCommitmentEvents([fakeEvent(0)]);

    const proof = poolStore.getProof(0);
    expect(proof.pathElements).toBeInstanceOf(Uint8Array);
    expect(proof.pathIndices).toBeInstanceOf(Uint8Array);
    expect(proof.root).toEqual(poolStore.getRoot());
  });

  it('processNullifierEvents stores nullifiers', async () => {
    const events: NullifierEvent[] = [
      { nullifier: '0xaaa', ledger: 100 },
      { nullifier: '0xbbb', ledger: 101 },
    ];
    await poolStore.processNullifierEvents(events);

    expect(await poolStore.isNullifierSpent('0xaaa')).toBe(true);
    expect(await poolStore.isNullifierSpent('0xbbb')).toBe(true);
    expect(await poolStore.isNullifierSpent('0xccc')).toBe(false);
  });

  it('skips duplicate events', async () => {
    await poolStore.processCommitmentEvents([fakeEvent(0), fakeEvent(1)]);
    const rootAfterFirst = poolStore.getRoot();

    // Process same events again
    await poolStore.processCommitmentEvents([fakeEvent(0), fakeEvent(1)]);
    expect(poolStore.getRoot()).toEqual(rootAfterFirst);
    expect(poolStore.getNextIndex()).toBe(2);
  });

  it('handles out-of-order events', async () => {
    // Send events in reverse order
    await poolStore.processCommitmentEvents([fakeEvent(1), fakeEvent(0)]);

    // Should produce same root as in-order
    const poolStore2 = new PoolStore(storage, bridge);
    await poolStore2.processCommitmentEvents([fakeEvent(0), fakeEvent(1)]);

    expect(poolStore.getRoot()).toEqual(poolStore2.getRoot());
  });

  it('processCommitmentEvents throws on non-contiguous batch', async () => {
    await expect(poolStore.processCommitmentEvents([fakeEvent(0), fakeEvent(2)]))
      .rejects.toThrow('event gap: expected index 1, got 2');
  });

  it('rebuildTree throws on non-contiguous leaf indices', async () => {
    // Manually insert leaves with a gap (index 0 and 2, missing 1)
    await storage.put('pool_leaves', { index: 0, commitment: fakeCommitment(0), ledger: 100 });
    await storage.put('pool_leaves', { index: 2, commitment: fakeCommitment(2), ledger: 100 });

    await expect(poolStore.rebuildTree()).rejects.toThrow('expected leaf index 1, got 2');
  });

  it('getRoot throws if tree not built', () => {
    const fresh = new PoolStore(storage, bridge);
    expect(() => fresh.getRoot()).toThrow('Tree not built');
  });

  it('getProof throws if tree not built', () => {
    const fresh = new PoolStore(storage, bridge);
    expect(() => fresh.getProof(0)).toThrow('Tree not built');
  });

  it('getNextIndex throws if tree not built', () => {
    const fresh = new PoolStore(storage, bridge);
    expect(() => fresh.getNextIndex()).toThrow('Tree not built');
  });
});
