/**
 * WasmBridge — loads and initializes the Rust WASM modules.
 * Provides typed access to all cryptographic operations.
 */

import { loadArtifact, defaultArtifactPath } from './loader.js';

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

  // Crypto methods will be added in the next task.
}
