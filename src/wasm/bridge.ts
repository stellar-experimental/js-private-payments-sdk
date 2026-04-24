/**
 * WasmBridge — loads and initializes the Rust WASM modules.
 * Provides typed access to all cryptographic operations.
 */

import { loadArtifact, defaultArtifactPath } from './loader.js';
import { bytesToBigIntLE } from '../utils.js';
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

  // --- Hashing ---

  poseidon2Hash(input0: Uint8Array, input1: Uint8Array, domain: number): Uint8Array {
    this.ensureReady();
    return this.proverModule.poseidon2_hash2(input0, input1, domain);
  }

  // --- Commitments & Nullifiers ---

  computeCommitment(amount: Uint8Array, pubKey: Uint8Array, blinding: Uint8Array): Uint8Array {
    this.ensureReady();
    return this.proverModule.compute_commitment(amount, pubKey, blinding);
  }

  computeSignature(privKey: Uint8Array, commitment: Uint8Array, pathIndices: Uint8Array): Uint8Array {
    this.ensureReady();
    return this.proverModule.compute_signature(privKey, commitment, pathIndices);
  }

  computeNullifier(commitment: Uint8Array, pathIndices: Uint8Array, signature: Uint8Array): Uint8Array {
    this.ensureReady();
    return this.proverModule.compute_nullifier(commitment, pathIndices, signature);
  }

  // --- Key Derivation ---

  deriveNotePrivateKey(signature: Uint8Array): Uint8Array {
    this.ensureReady();
    return this.proverModule.derive_note_private_key(signature);
  }

  derivePublicKey(privateKey: Uint8Array): Uint8Array {
    this.ensureReady();
    return this.proverModule.derive_public_key(privateKey);
  }

  deriveEncryptionKeypair(signature: Uint8Array): { publicKey: Uint8Array; privateKey: Uint8Array } {
    this.ensureReady();
    const bytes: Uint8Array = this.proverModule.derive_keypair_from_signature(signature);
    return {
      publicKey: bytes.slice(0, 32),
      privateKey: bytes.slice(32, 64),
    };
  }

  // --- Blinding & Field ---

  generateBlinding(): Uint8Array {
    this.ensureReady();
    return this.proverModule.generate_random_blinding();
  }

  bigintToField(value: bigint): Uint8Array {
    this.ensureReady();
    return this.proverModule.decimal_to_field_bytes(value.toString());
  }

  bn256Modulus(): bigint {
    this.ensureReady();
    return bytesToBigIntLE(this.proverModule.bn256_modulus());
  }

  // --- Encryption ---

  encryptNote(recipientPubKey: Uint8Array, plaintext: Uint8Array): Uint8Array {
    this.ensureReady();
    return this.proverModule.encrypt_note_data(recipientPubKey, plaintext);
  }

  decryptNote(privateKey: Uint8Array, ciphertext: Uint8Array): Uint8Array | null {
    this.ensureReady();
    const result = this.proverModule.decrypt_note_data(privateKey, ciphertext);
    if (!result || result.length === 0) return null;
    return result;
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
