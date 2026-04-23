/**
 * Pluggable storage backend for persisting SDK state.
 * The SDK stores notes, Merkle tree leaves, nullifiers, and sync progress.
 *
 * Ships with:
 * - MemoryStorage (testing)
 * - IndexedDBStorage (browser)
 * - FileSystemStorage (Node.js)
 *
 * Wallet developers can implement this interface to use their own database.
 *
 * Store names used by the SDK:
 * - pool_leaves: { index (key), commitment, ledger }
 * - pool_nullifiers: { nullifier (key), ledger }
 * - pool_encrypted_outputs: { commitment (key), index, encryptedOutput, ledger }
 * - asp_membership_leaves: { index (key), leaf, root, ledger }
 * - user_notes: { id (key), owner, blinding, amount, leafIndex, spent, ... }
 * - registered_public_keys: { address (key), encryptionKey, noteKey, ledger }
 * - sync_metadata: { pool (key), lastSyncedLedger }
 * - retention_config: { rpcEndpoint (key), windowLedgers, detectedAt }
 */
/** Primary key field for each store. Used by storage implementations to key records. */
export const STORE_KEYS = {
  pool_leaves: 'index',
  pool_nullifiers: 'nullifier',
  pool_encrypted_outputs: 'commitment',
  asp_membership_leaves: 'index',
  user_notes: 'id',
  registered_public_keys: 'address',
  sync_metadata: 'pool',
  retention_config: 'rpcEndpoint',
} as const;

export type StoreName = keyof typeof STORE_KEYS;

export interface StorageBackend {
  /** Initialize the storage backend (e.g., open IndexedDB connection). No-op for backends that don't need it. */
  init(): Promise<void>;
  get(store: StoreName, key: any): Promise<any | undefined>;
  getAll(store: StoreName): Promise<any[]>;
  getAllByIndex(store: StoreName, index: string, value: any): Promise<any[]>;
  put(store: StoreName, value: any): Promise<void>;
  putAll(store: StoreName, values: any[]): Promise<void>;
  del(store: StoreName, key: any): Promise<void>;
  clear(store: StoreName): Promise<void>;
  clearAll(): Promise<void>;
  count(store: StoreName): Promise<number>;
  iterate(store: StoreName, callback: (value: any) => boolean | void): Promise<void>;
}
