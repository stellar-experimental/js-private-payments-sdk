import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { WasmBridge } from '../../wasm/bridge.js';
import { MemoryStorage } from '../../storage/memory.js';
import { ASPMembershipStore } from '../asp-membership-store.js';
import type { ASPMembershipEvent } from '../../types.js';

function fakeLeaf(index: number): string {
  return '0x' + (index + 1).toString(16).padStart(64, '0');
}

function fakeEvent(index: number, ledger: number = 100): ASPMembershipEvent {
  return {
    leaf: fakeLeaf(index),
    index,
    root: '0x' + 'ff'.repeat(32),
    ledger,
  };
}

describe('ASPMembershipStore', () => {
  let bridge: WasmBridge;
  let storage: MemoryStorage;
  let store: ASPMembershipStore;

  beforeAll(async () => {
    bridge = new WasmBridge();
    await bridge.initialize();
  });

  beforeEach(async () => {
    storage = new MemoryStorage();
    await storage.init();
    store = new ASPMembershipStore(storage, bridge);
  });

  it('rebuildTree creates empty tree', async () => {
    await store.rebuildTree();
    const root = store.getRoot();
    expect(root).toBeInstanceOf(Uint8Array);
    expect(root.length).toBe(32);
  });

  it('processMembershipEvents inserts leaves and updates tree', async () => {
    await store.rebuildTree();
    const rootBefore = store.getRoot();

    await store.processMembershipEvents([fakeEvent(0), fakeEvent(1)]);

    expect(store.getRoot()).not.toEqual(rootBefore);
    expect(store.getNextIndex()).toBe(2);
  });

  it('processMembershipEvents stores leaves in storage', async () => {
    await store.processMembershipEvents([fakeEvent(0)]);
    const leaf = await storage.get('asp_membership_leaves', 0);
    expect(leaf).toBeDefined();
    expect(leaf.leaf).toBe(fakeLeaf(0));
  });

  it('rebuildTree restores from storage', async () => {
    await store.processMembershipEvents([fakeEvent(0), fakeEvent(1)]);
    const rootAfterInsert = store.getRoot();

    const newStore = new ASPMembershipStore(storage, bridge);
    await newStore.rebuildTree();

    expect(newStore.getRoot()).toEqual(rootAfterInsert);
    expect(newStore.getNextIndex()).toBe(2);
  });

  it('getProof returns valid proof', async () => {
    await store.processMembershipEvents([fakeEvent(0)]);
    const proof = store.getProof(0);
    expect(proof.pathElements).toBeInstanceOf(Uint8Array);
    expect(proof.pathIndices).toBeInstanceOf(Uint8Array);
    expect(proof.root).toEqual(store.getRoot());
  });

  it('skips duplicate events', async () => {
    await store.processMembershipEvents([fakeEvent(0), fakeEvent(1)]);
    const rootAfterFirst = store.getRoot();

    await store.processMembershipEvents([fakeEvent(0), fakeEvent(1)]);
    expect(store.getRoot()).toEqual(rootAfterFirst);
    expect(store.getNextIndex()).toBe(2);
  });

  it('handles out-of-order events', async () => {
    await store.processMembershipEvents([fakeEvent(1), fakeEvent(0)]);

    const store2 = new ASPMembershipStore(storage, bridge);
    await store2.processMembershipEvents([fakeEvent(0), fakeEvent(1)]);

    expect(store.getRoot()).toEqual(store2.getRoot());
  });

  it('rebuildTree throws on non-contiguous indices', async () => {
    await storage.put('asp_membership_leaves', { index: 0, leaf: fakeLeaf(0), root: '', ledger: 100 });
    await storage.put('asp_membership_leaves', { index: 2, leaf: fakeLeaf(2), root: '', ledger: 100 });

    await expect(store.rebuildTree()).rejects.toThrow('expected leaf index 1, got 2');
  });

  it('getRoot throws if tree not built', () => {
    const fresh = new ASPMembershipStore(storage, bridge);
    expect(() => fresh.getRoot()).toThrow('Tree not built');
  });

  it('getProof throws if tree not built', () => {
    const fresh = new ASPMembershipStore(storage, bridge);
    expect(() => fresh.getProof(0)).toThrow('Tree not built');
  });

  it('getNextIndex throws if tree not built', () => {
    const fresh = new ASPMembershipStore(storage, bridge);
    expect(() => fresh.getNextIndex()).toThrow('Tree not built');
  });
});
