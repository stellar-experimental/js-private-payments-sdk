/** Opaque handle to a WASM MerkleTree instance. */
export type MerkleTreeHandle = { readonly __brand: 'MerkleTree' };

export interface CommitmentEvent {
  commitment: string;
  index: number;
  encryptedOutput: Uint8Array;
  ledger: number;
}

export interface NullifierEvent {
  nullifier: string;
  ledger: number;
}

export interface PoolEvents {
  commitments: CommitmentEvent[];
  nullifiers: NullifierEvent[];
  latestLedger: number;
}

export interface ASPMembershipEvent {
  leaf: string;
  index: number;
  root: string;
  ledger: number;
}

export interface ASPMembershipEvents {
  leaves: ASPMembershipEvent[];
  latestLedger: number;
}

export interface SyncResult {
  fromLedger: number;
  toLedger: number;
  newCommitments: number;
  newNullifiers: number;
  newMembershipLeaves: number;
}
