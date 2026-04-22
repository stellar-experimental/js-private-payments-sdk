/**
 * WasmBridge — loads and initializes the Rust WASM modules.
 * Provides typed access to all cryptographic operations.
 */

import { loadArtifact, defaultArtifactPath } from './loader.js';
import type { MerkleTreeHandle } from '../types.js';

export interface WasmBridgeConfig {
  /** Proving key bytes or path. Default: bundled artifact. */
  provingKey?: string | Uint8Array;
  /** R1CS constraint system bytes or path. Default: bundled artifact. */
  r1cs?: string | Uint8Array;
  /** Circuit WASM bytes or path. Default: bundled artifact. */
  circuitWasm?: string | Uint8Array;
}

export class WasmBridge {
  private proverModule: any = null;
  private witnessModule: any = null;
  private proverInstance: any = null;
  private witnessInstance: any = null;
  private initialized = false;

  async initialize(config: WasmBridgeConfig = {}): Promise<void> {
    if (this.initialized) return;

    // Load WASM module glue code
    const proverGlue = await import(defaultArtifactPath('prover.js'));
    const witnessGlue = await import(defaultArtifactPath('witness.js'));

    // Load WASM binaries
    const proverWasm = await loadArtifact(defaultArtifactPath('prover_bg.wasm'));
    const witnessWasm = await loadArtifact(defaultArtifactPath('witness_bg.wasm'));

    // Initialize WASM modules with binary bytes
    proverGlue.initSync({ module: proverWasm });
    witnessGlue.initSync({ module: witnessWasm });

    this.proverModule = proverGlue;
    this.witnessModule = witnessGlue;

    // Load circuit artifacts
    const provingKey = await loadArtifact(config.provingKey ?? defaultArtifactPath('policy_tx_2_2_proving_key.bin'));
    const r1cs = await loadArtifact(config.r1cs ?? defaultArtifactPath('policy_tx_2_2.r1cs'));
    const circuitWasm = await loadArtifact(config.circuitWasm ?? defaultArtifactPath('policy_tx_2_2.wasm'));

    // Create prover and witness calculator instances
    this.proverInstance = new proverGlue.Prover(provingKey, r1cs);
    this.witnessInstance = new witnessGlue.WitnessCalculator(circuitWasm, r1cs);

    this.initialized = true;
  }

  isReady(): boolean {
    return this.initialized;
  }

  version(): string {
    this.ensureReady();
    return this.proverModule.version();
  }

  private ensureReady(): void {
    if (!this.initialized) throw new Error('WasmBridge not initialized. Call initialize() first.');
  }

  // --- Merkle Tree ---

  createTree(depth: number): MerkleTreeHandle {
    this.ensureReady();
    return this.proverModule.MerkleTree.new_with_zero_leaf(depth, this.zeroLeaf()) as MerkleTreeHandle;
  }

  freeTree(tree: MerkleTreeHandle): void {
    (tree as any).free?.();
  }

  insertLeaf(tree: MerkleTreeHandle, leaf: Uint8Array): number {
    this.ensureReady();
    return (tree as any).insert(leaf);
  }

  getRoot(tree: MerkleTreeHandle): Uint8Array {
    this.ensureReady();
    return (tree as any).root();
  }

  getProof(tree: MerkleTreeHandle, index: number): { pathElements: Uint8Array; pathIndices: Uint8Array; root: Uint8Array } {
    this.ensureReady();
    const proof = (tree as any).get_proof(index);
    return {
      pathElements: proof.path_elements,
      pathIndices: proof.path_indices,
      root: proof.root,
    };
  }

  getNextIndex(tree: MerkleTreeHandle): number {
    this.ensureReady();
    return Number((tree as any).next_index);
  }

  private zeroLeaf(): Uint8Array {
    return this.proverModule.zero_leaf();
  }
}
