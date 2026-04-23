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

export interface ASPMembershipEvent {
  leaf: string;
  index: number;
  root: string;
  ledger: number;
}
