import type { Signer } from './signer/signer.js';
import type { StorageBackend } from './storage/storage.js';
import type { MembershipProofData, NonMembershipProofData } from './types.js';
import { WasmBridge } from './wasm/bridge.js';
import { CircuitInputBuilder } from './wasm/circuit-input-builder.js';
import { RpcClient } from './stellar/rpc-client.js';
import { PoolStore } from './sync/pool-store.js';
import { ASPMembershipStore } from './sync/asp-membership-store.js';
import { syncAll } from './sync/sync.js';
import { MemoryStorage } from './storage/memory.js';
import { xlmToStroops } from './utils.js';

export interface PrivatePoolConfig {
  rpcUrl: string;
  networkPassphrase: string;
  poolContract: string;
  aspMembershipContract: string;
  signer: Signer;
  storage?: StorageBackend;
}

export class PrivatePool {
  private config: PrivatePoolConfig;
  private storage: StorageBackend;
  private bridge: WasmBridge;
  private rpcClient: RpcClient;
  private circuitInputBuilder: CircuitInputBuilder;
  private poolStore: PoolStore;
  private aspMembershipStore: ASPMembershipStore;

  private privKeyBytes: Uint8Array | null = null;
  private pubKeyBytes: Uint8Array | null = null;
  private encryptionPubKey: Uint8Array | null = null;
  private initialized = false;

  constructor(config: PrivatePoolConfig) {
    this.config = config;
    this.storage = config.storage ?? new MemoryStorage();
    this.bridge = new WasmBridge();
    this.rpcClient = new RpcClient({
      rpcUrl: config.rpcUrl,
      networkPassphrase: config.networkPassphrase,
    });
    this.circuitInputBuilder = new CircuitInputBuilder(this.bridge);
    this.poolStore = new PoolStore(this.storage, this.bridge);
    this.aspMembershipStore = new ASPMembershipStore(this.storage, this.bridge);
  }

  async initialize(): Promise<void> { throw new Error('not implemented'); }
  async sync() {
    this.ensureInitialized();
    return syncAll(
      this.rpcClient, this.storage, this.poolStore, this.aspMembershipStore,
      this.config.poolContract, this.config.aspMembershipContract,
    );
  }
  async transfer() { throw new Error('not implemented'); }
  async withdraw() { throw new Error('not implemented'); }
  getBalance() { throw new Error('not implemented'); }
  getNotes() { throw new Error('not implemented'); }

  /**
   * Deposit tokens from the user's Stellar wallet into the privacy pool.
   * Sync → build circuit inputs → generate proof → submit transaction → post-sync.
   * @param amountXlm - Amount in XLM
   * @returns Transaction hash and ledger
   */
  async deposit(amountXlm: number): Promise<{ txHash: string; ledger: number }> {
    this.ensureInitialized();
    const amountStroops = xlmToStroops(amountXlm);

    // 1. Sync
    await this.sync();

    // 2. Get ASP proofs
    const membershipProof = await this.getMembershipProof();
    const nonMembershipProof = await this.getNonMembershipProof();

    // 3. Build circuit inputs
    const built = this.circuitInputBuilder.buildDeposit({
      amountStroops,
      privKeyBytes: this.privKeyBytes!,
      pubKeyBytes: this.pubKeyBytes!,
      encryptionPubKey: this.encryptionPubKey!,
      poolRoot: this.poolStore.getRoot(),
      membershipProof,
      nonMembershipProof,
      poolContractAddress: this.config.poolContract,
    });

    // 4. Generate proof
    const { proof, publicInputs } = this.bridge.prove(built.circuitInputs);

    // 5. Submit transaction
    const result = await this.rpcClient.submitTransaction({
      poolContractAddress: this.config.poolContract,
      signer: this.config.signer,
      proof,
      publicInputs,
      extData: built.extData,
    });

    // 6. Post-sync
    await this.sync();

    return result;
  }

  private ensureInitialized(): void {
    if (!this.initialized) throw new Error('PrivatePool not initialized. Call initialize() first.');
  }

  private async getMembershipProof(): Promise<MembershipProofData> {
    throw new Error('not implemented');
  }

  private async getNonMembershipProof(): Promise<NonMembershipProofData> {
    throw new Error('not implemented');
  }
}
