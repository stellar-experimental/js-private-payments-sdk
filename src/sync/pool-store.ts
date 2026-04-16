import type { StorageBackend } from '../storage/storage.js';
import type { WasmBridge } from '../wasm/bridge.js';
import type { MerkleTreeHandle, CommitmentEvent, NullifierEvent } from '../types.js';
import { TREE_DEPTH, hexToBytes } from '../utils.js';

export class PoolStore {
  private tree: MerkleTreeHandle | null = null;

  constructor(private storage: StorageBackend, private bridge: WasmBridge) {}

  async rebuildTree(): Promise<void> {
    this.tree = this.bridge.createTree(TREE_DEPTH);
    const leaves = await this.storage.getAll('pool_leaves');
    leaves.sort((a, b) => a.index - b.index);
    for (const leaf of leaves) {
      this.bridge.insertLeaf(this.tree, hexToBytes(leaf.commitment));
    }
  }

  async processCommitmentEvents(events: CommitmentEvent[]): Promise<void> {
    if (!this.tree) await this.rebuildTree();
    for (const event of events) {
      await this.storage.put('pool_leaves', {
        index: event.index,
        commitment: event.commitment,
        ledger: event.ledger,
      });
      await this.storage.put('pool_encrypted_outputs', {
        commitment: event.commitment,
        index: event.index,
        encryptedOutput: event.encryptedOutput,
        ledger: event.ledger,
      });
      this.bridge.insertLeaf(this.tree!, hexToBytes(event.commitment));
    }
  }

  async processNullifierEvents(events: NullifierEvent[]): Promise<void> {
    for (const event of events) {
      await this.storage.put('pool_nullifiers', {
        nullifier: event.nullifier,
        ledger: event.ledger,
      });
    }
  }

  getRoot(): Uint8Array {
    return this.bridge.getRoot(this.ensureTree());
  }

  getProof(leafIndex: number): { pathElements: Uint8Array; pathIndices: Uint8Array; root: Uint8Array } {
    return this.bridge.getProof(this.ensureTree(), leafIndex);
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
