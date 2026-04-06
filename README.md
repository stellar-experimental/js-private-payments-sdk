# Private Payments SDK

A TypeScript SDK for interacting with Stellar Private Payments pools. Deposit, transfer, and withdraw tokens privately using zero-knowledge proofs.

> **Status: Proof of Concept** — This SDK is a prototype for demonstration and partner evaluation. It is not audited and should not be used with real assets. Testnet only.

## Overview

The Stellar Private Payments protocol enables private token transfers on the Stellar network using ZK proofs (Groth16). This SDK wraps the protocol's client-side logic — proof generation, state management, contract interaction — into a clean, `npm install`-able package.

**What the SDK handles for you:**
- ZK proof generation (WASM-based Groth16 prover)
- Local Merkle tree management (synced from on-chain events)
- Note discovery and tracking (encrypted UTXO scanning)
- Transaction construction and submission
- ASP (Association Set Provider) compliance proofs

**What you provide:**
- A `Signer` (wallet integration for signing transactions)
- A pool contract address
- An RPC endpoint

## Installation

```bash
npm install private-payments-sdk
```

For Freighter wallet support (browser):
```bash
npm install private-payments-sdk @stellar/freighter-api
```

## Quick Start

### Browser (with Freighter wallet)

```ts
import { PrivatePool, FreighterSigner } from 'private-payments-sdk';

const pool = new PrivatePool({
  rpcUrl: 'https://soroban-testnet.stellar.org',
  networkPassphrase: 'Test SDF Network ; September 2015',
  poolContract: 'CA2TZ...',
  signer: new FreighterSigner(),
});

// Initialize: loads WASM, derives keys, auto-registers in ASP membership if needed
await pool.initialize();

// Sync: fetch on-chain events, rebuild local Merkle tree
await pool.sync();

// Deposit 10 XLM into the privacy pool
const deposit = await pool.deposit(10);
console.log('Deposit tx:', deposit.txHash);

// Check balance
console.log('Balance:', pool.getBalance()); // "10"

// Transfer 5 XLM privately to Bob
const transfer = await pool.transfer('0x1a2b3c...', 5);

// Withdraw 3 XLM back to Stellar wallet
const withdraw = await pool.withdraw(3);
```

### Node.js (with secret key)

```ts
import { PrivatePool } from 'private-payments-sdk';
import { Keypair, TransactionBuilder, Networks } from '@stellar/stellar-sdk';

// Implement the Signer interface with a raw keypair
class KeypairSigner {
  private keypair: Keypair;
  constructor(secret: string) { this.keypair = Keypair.fromSecret(secret); }

  async getPublicKey() { return this.keypair.publicKey(); }

  async signTransaction(xdr: string, opts?: { networkPassphrase?: string }) {
    const tx = TransactionBuilder.fromXDR(xdr, opts?.networkPassphrase || Networks.TESTNET);
    tx.sign(this.keypair);
    return { signedTxXdr: tx.toXDR(), signerAddress: this.keypair.publicKey() };
  }

  async signAuthEntry(xdr: string) {
    const signed = this.keypair.sign(Buffer.from(xdr, 'base64'));
    return { signedAuthEntry: signed.toString('base64'), signerAddress: this.keypair.publicKey() };
  }

  async signMessage(message: string) {
    const signed = this.keypair.sign(Buffer.from(message));
    return { signedMessage: signed.toString('hex'), signerAddress: this.keypair.publicKey() };
  }
}

const pool = new PrivatePool({
  rpcUrl: 'https://soroban-testnet.stellar.org',
  networkPassphrase: 'Test SDF Network ; September 2015',
  poolContract: 'CA2TZ...',
  signer: new KeypairSigner('SCZANGBA5YHTNYVVV3C7CAZMCLP...'),
});

await pool.initialize();
await pool.deposit(100);
console.log('Balance:', pool.getBalance());
```

## Configuration

```ts
interface PrivatePoolConfig {
  /** Soroban RPC URL */
  rpcUrl: string;

  /** Stellar network passphrase */
  networkPassphrase: string;

  /** Pool contract address — SDK reads verifier + ASP addresses from it */
  poolContract: string;

  /** Wallet signer */
  signer: Signer;

  /** Optional: storage backend (auto-detected by default) */
  storage?: StorageBackend;

  /** Optional: override ZK artifact paths (default: bundled) */
  artifactPaths?: {
    provingKey?: string | Uint8Array;
    r1cs?: string | Uint8Array;
    circuitWasm?: string | Uint8Array;
  };
}
```

## Transaction Flow

All three operations (deposit, transfer, withdraw) follow the same pattern:

```
1. Sync        →  Fetch on-chain events, rebuild local Merkle tree
2. Build       →  Construct ZK circuit inputs (commitments, nullifiers, proofs)
3. Prove       →  Generate Groth16 proof via WASM (~1-2 seconds)
4. Submit      →  Sign and submit Soroban transaction
5. Post-sync   →  Fetch new events, update local state
```

The difference is in what gets built:

| Operation | Token flow | Inputs (notes spent) | Outputs (notes created) |
|-----------|-----------|---------------------|------------------------|
| **Deposit** | User wallet → Pool | None (dummy) | 2 notes for self |
| **Transfer** | None (pool internal) | 1-2 real notes | 1 for recipient + 1 change |
| **Withdraw** | Pool → Stellar address | 1-2 real notes | 2 dummy notes |

See [docs/](docs/) for detailed sequence diagrams.

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     PrivatePool (facade)                   │
│                                                            │
│   The single entry point. Orchestrates all components.     │
│   deposit() / transfer() / withdraw() / sync()             │
└─────┬────────────┬─────────────┬─────────────┬─────────────┘
      │            │             │             │
      ▼            ▼             ▼             ▼
   Signer      Storage       WasmBridge   syncAll()
      │            │             │         ├── PoolStore
      │            │             ▼         ├── NoteManager
      │            │         Prover etc    └── ASPMembershipStore
      │            │
      ▼            ▼
 FreighterSigner MemoryStorage / IndexedDBStorage / FileSystemStorage
```

### Components

| Component | What it does |
|-----------|-------------|
| **PrivatePool** | Facade class — the only thing users interact with |
| **Signer** | Interface for wallet signing (Freighter, Lobstr, custom keypair) |
| **StorageBackend** | Interface for persisting notes, Merkle trees, sync state |
| **WasmBridge** | Wraps Rust WASM modules for crypto: Poseidon2 hashing, commitments, encryption, Merkle trees |
| **Prover** | Orchestrates ZK proof generation (Web Worker in browser, direct WASM in Node.js) |
| **CircuitInputBuilder** | Builds ZK circuit inputs for deposit/transfer/withdraw |
| **RpcClient** | Thin wrapper around Stellar SDK for Soroban RPC calls |
| **syncAll()** | Function that fetches on-chain events and updates local state |
| **PoolStore** | Local Merkle tree of pool commitments |
| **NoteManager** | User note storage, discovery (event decryption), UTXO selection |
| **ASPMembershipStore** | Tracks ASP approved set for compliance proofs |

## Core Interfaces

### Signer

Any wallet integrates by implementing 4 methods:

```ts
interface Signer {
  getPublicKey(): Promise<string>;
  signTransaction(xdr: string, opts?: { networkPassphrase?: string }): Promise<{ signedTxXdr: string; signerAddress: string }>;
  signAuthEntry(xdr: string, opts?: { networkPassphrase?: string }): Promise<{ signedAuthEntry: string; signerAddress: string }>;
  signMessage(message: string): Promise<{ signedMessage: string; signerAddress: string }>;
}
```

The SDK ships a `FreighterSigner` adapter for the Freighter browser wallet. For other wallets, implement `Signer` wrapping their API.

### StorageBackend

The SDK persists state (notes, Merkle tree, sync progress) via a pluggable storage interface:

```ts
interface StorageBackend {
  get(store: string, key: string): Promise<any | undefined>;
  getAll(store: string): Promise<any[]>;
  getAllByIndex(store: string, index: string, value: any): Promise<any[]>;
  put(store: string, value: any): Promise<void>;
  putAll(store: string, values: any[]): Promise<void>;
  del(store: string, key: string): Promise<void>;
  clear(store: string): Promise<void>;
  clearAll(): Promise<void>;
  count(store: string): Promise<number>;
  iterate(store: string, callback: (value: any) => boolean | void): Promise<void>;
}
```

Ships with:
- **`MemoryStorage`** — in-memory, for testing
- **`IndexedDBStorage`** — browser persistent storage
- **`FileSystemStorage`** — Node.js file-based storage

## Project Structure

```
src/
  index.ts                    # Public exports
  types.ts                    # Data types (UserNote, TransactionResult, config)
  errors.ts                   # SDK error classes
  utils.ts                    # XLM/stroops conversion, hex/bytes helpers
  private-pool.ts             # PrivatePool facade

  signer/
    signer.ts                 # Signer interface
    freighter.ts              # FreighterSigner adapter

  storage/
    storage.ts                # StorageBackend interface
    memory.ts                 # In-memory (testing)
    indexeddb.ts              # Browser (IndexedDB)
    filesystem.ts             # Node.js (JSON files)

  wasm/
    bridge.ts                 # WasmBridge — typed wrapper around WASM exports
    loader.ts                 # Isomorphic WASM loading (browser vs Node)
    prover.ts                 # Prover — proof generation orchestrator
    circuit-input-builder.ts  # ZK circuit input construction

  sync/
    sync.ts                   # syncAll() function
    pool-store.ts             # Pool Merkle tree
    asp-membership-store.ts   # ASP approved set
    note-manager.ts           # Note storage, discovery, balance

  stellar/
    rpc-client.ts             # Thin wrapper around Stellar SDK

artifacts/                    # Pre-built WASM binaries + circuit artifacts
```

## Development

```bash
npm install          # Install dependencies
npm run build        # Build (tsup → dist/)
npm run typecheck    # Type check without emitting
npm test             # Run tests (vitest)
```

## Status

This is a proof-of-concept SDK. Current limitations:

- Testnet only (no mainnet deployment)
- Single circuit size (2-in, 2-out transactions)
- 7-day RPC event retention window
- Not security audited
- WASM artifacts bundled (~14MB package size)

## License

Apache-2.0
