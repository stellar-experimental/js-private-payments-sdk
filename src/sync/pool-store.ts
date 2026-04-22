import type { StorageBackend } from '../storage/storage.js';
import type { WasmBridge } from '../wasm/bridge.js';
import type { MerkleTreeHandle, CommitmentEvent, NullifierEvent } from '../types.js';
import { TREE_DEPTH, hexToBytes } from '../utils.js';

export class PoolStore {
  private tree: MerkleTreeHandle | null = null;

  constructor(private storage: StorageBackend, private bridge: WasmBridge) {}

  async rebuildTree(): Promise<void> {
    if (this.tree) this.bridge.freeTree(this.tree);
    this.tree = this.bridge.createTree(TREE_DEPTH);
    const leaves = await this.storage.getAll('pool_leaves');
    leaves.sort((a, b) => a.index - b.index);
    for (const leaf of leaves) {
      const expected = this.bridge.getNextIndex(this.tree);
      if (leaf.index !== expected) {
        throw new Error(`Pool tree rebuild failed: expected leaf index ${expected}, got ${leaf.index}. Storage may be corrupted or missing leaves.`);
      }
      this.bridge.insertLeaf(this.tree, hexToBytes(leaf.commitment));
    }
  }

  async processCommitmentEvents(events: CommitmentEvent[]): Promise<void> {
    if (!this.tree) await this.rebuildTree();
    const sorted = [...events].sort((a, b) => a.index - b.index);

    const newLeaves: any[] = [];
    const newOutputs: any[] = [];

    for (const event of sorted) {
      const nextIndex = this.bridge.getNextIndex(this.tree!);
      if (event.index < nextIndex) continue;
      if (event.index !== nextIndex) {
        throw new Error(`Pool commitment event gap: expected index ${nextIndex}, got ${event.index}`);
      }
      newLeaves.push({ index: event.index, commitment: event.commitment, ledger: event.ledger });
      newOutputs.push({ commitment: event.commitment, index: event.index, encryptedOutput: event.encryptedOutput, ledger: event.ledger });
      this.bridge.insertLeaf(this.tree!, hexToBytes(event.commitment));
    }

    await this.storage.putAll('pool_leaves', newLeaves);
    await this.storage.putAll('pool_encrypted_outputs', newOutputs);
  }

  async processNullifierEvents(events: NullifierEvent[]): Promise<void> {
    await this.storage.putAll('pool_nullifiers', events.map(e => ({
      nullifier: e.nullifier,
      ledger: e.ledger,
    })));
  }

  getRoot(): Uint8Array {
    return this.bridge.getRoot(this.ensureTree());
  }

  getProof(leafIndex: number): { pathElements: Uint8Array; pathIndices: Uint8Array; root: Uint8Array } {
    const tree = this.ensureTree();
    const next = this.bridge.getNextIndex(tree);
    if (!Number.isInteger(leafIndex) || leafIndex < 0 || leafIndex >= next) {
      throw new Error(`getProof: leafIndex ${leafIndex} out of bounds (tree has ${next} leaves)`);
    }
    return this.bridge.getProof(tree, leafIndex);
  }

  getNextIndex(): number {
    return this.bridge.getNextIndex(this.ensureTree());
  }

  async isNullifierSpent(nullifier: string): Promise<boolean> {
    const record = await this.storage.get('pool_nullifiers', nullifier);
    return record !== undefined;
  }

  private ensureTree(): MerkleTreeHandle {
    if (!this.tree) throw new Error('Tree not built. Call rebuildTree() first.');
    return this.tree;
  }
}
