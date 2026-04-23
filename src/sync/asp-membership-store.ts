import type { StorageBackend } from '../storage/storage.js';
import type { WasmBridge } from '../wasm/bridge.js';
import type { MerkleTreeHandle, ASPMembershipEvent } from '../types.js';
import { ASP_TREE_DEPTH, hexToBytes } from '../utils.js';

export class ASPMembershipStore {
  private tree: MerkleTreeHandle | null = null;

  constructor(private storage: StorageBackend, private bridge: WasmBridge) {}

  async rebuildTree(): Promise<void> {
    if (this.tree) this.bridge.freeTree(this.tree);
    this.tree = this.bridge.createTree(ASP_TREE_DEPTH);
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
    const startIndex = this.bridge.getNextIndex(this.tree!);
    const fresh = sorted.filter(e => e.index >= startIndex);

    // Validate contiguity before mutating
    for (let i = 0; i < fresh.length; i++) {
      const expected = startIndex + i;
      if (fresh[i].index !== expected) {
        throw new Error(`ASP membership event gap: expected index ${expected}, got ${fresh[i].index}`);
      }
    }

    // Mutate tree + persist
    for (const event of fresh) {
      this.bridge.insertLeaf(this.tree!, hexToBytes(event.leaf));
    }

    await this.storage.putAll('asp_membership_leaves', fresh);
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

  private ensureTree(): MerkleTreeHandle {
    if (!this.tree) throw new Error('Tree not built. Call rebuildTree() first.');
    return this.tree;
  }
}
