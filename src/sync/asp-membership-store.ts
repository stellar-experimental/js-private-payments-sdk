import type { StorageBackend } from '../storage/storage.js';
import type { WasmBridge } from '../wasm/bridge.js';
import type { MerkleTreeHandle, ASPMembershipEvent } from '../types.js';
import { TREE_DEPTH, hexToBytes } from '../utils.js';

export class ASPMembershipStore {
  private tree: MerkleTreeHandle | null = null;

  constructor(private storage: StorageBackend, private bridge: WasmBridge) {}

  async rebuildTree(): Promise<void> {
    this.tree = this.bridge.createTree(TREE_DEPTH);
    const leaves = await this.storage.getAll('asp_membership_leaves');
    leaves.sort((a, b) => a.index - b.index);
    for (const leaf of leaves) {
      const expected = this.bridge.getNextIndex(this.tree);
      if (leaf.index !== expected) {
        throw new Error(`ASP membership tree rebuild failed: expected leaf index ${expected}, got ${leaf.index}. Storage may be corrupted or missing leaves.`);
      }
      this.bridge.insertLeaf(this.tree, hexToBytes(leaf.leaf));
    }
  }

  async processMembershipEvents(events: ASPMembershipEvent[]): Promise<void> {
    if (!this.tree) await this.rebuildTree();
    const sorted = [...events].sort((a, b) => a.index - b.index);

    const newLeaves: ASPMembershipEvent[] = [];
    for (const event of sorted) {
      const nextIndex = this.bridge.getNextIndex(this.tree!);
      if (event.index < nextIndex) continue;
      if (event.index !== nextIndex) {
        throw new Error(`ASP membership event gap: expected index ${nextIndex}, got ${event.index}`);
      }
      newLeaves.push({ index: event.index, leaf: event.leaf, root: event.root, ledger: event.ledger });
      this.bridge.insertLeaf(this.tree!, hexToBytes(event.leaf));
    }

    await this.storage.putAll('asp_membership_leaves', newLeaves);
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

  private ensureTree(): MerkleTreeHandle {
    if (!this.tree) throw new Error('Tree not built. Call rebuildTree() first.');
    return this.tree;
  }
}
