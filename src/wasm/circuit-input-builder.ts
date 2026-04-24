/**
 * CircuitInputBuilder — constructs the inputs for the ZK circuit.
 * Assembles commitments, nullifiers, encrypted outputs, Merkle proofs,
 * ASP compliance data, and external data hashes into the format
 * the Circom witness calculator expects.
 */

import { keccak_256 } from '@noble/hashes/sha3';
import { Address, xdr, XdrLargeInt } from '@stellar/stellar-sdk';
import type { WasmBridge } from './bridge.js';
import type { MembershipProofData, NonMembershipProofData } from '../types.js';
import { bytesToBigIntLE, bytesToBigIntBE, POOL_TREE_DEPTH } from '../utils.js';

interface BuiltDeposit {
  circuitInputs: Record<string, any>;
  extData: {
    recipient: string;
    ext_amount: bigint;
    encrypted_output0: Uint8Array;
    encrypted_output1: Uint8Array;
  };
  outputNotes: Array<{
    amount: bigint;
    blinding: bigint;
    blindingBytes: Uint8Array;
    pubKeyBytes: Uint8Array;
    commitmentBytes: Uint8Array;
    commitmentBig: bigint;
  }>;
}

export class CircuitInputBuilder {
  private bn256Mod: bigint | null = null;

  constructor(private bridge: WasmBridge) {}

  private getBn256Mod(): bigint {
    if (!this.bn256Mod) this.bn256Mod = this.bridge.bn256Modulus();
    return this.bn256Mod;
  }

  /**
   * Build circuit inputs for a deposit.
   * @param params.amountStroops - Deposit amount in stroops
   * @param params.privKeyBytes - User's BN254 private key (32 bytes)
   * @param params.pubKeyBytes - User's BN254 public key (32 bytes)
   * @param params.encryptionPubKey - User's X25519 encryption public key (32 bytes)
   * @param params.poolRoot - Current pool Merkle root
   * @param params.membershipProof - ASP membership proof data
   * @param params.nonMembershipProof - ASP non-membership proof data
   * @param params.poolContractAddress - Pool contract Stellar address (recipient of deposit)
   * @returns Circuit inputs, ext data, and output notes
   */
  buildDeposit(params: {
    amountStroops: bigint;
    privKeyBytes: Uint8Array;
    pubKeyBytes: Uint8Array;
    encryptionPubKey: Uint8Array;
    poolRoot: Uint8Array;
    membershipProof: MembershipProofData;
    nonMembershipProof: NonMembershipProofData;
    poolContractAddress: string;
  }): BuiltDeposit {
    const {
      amountStroops, privKeyBytes, pubKeyBytes, encryptionPubKey,
      poolRoot, membershipProof, nonMembershipProof, poolContractAddress,
    } = params;

    const privKeyBigInt = bytesToBigIntLE(privKeyBytes);

    // Create 2 dummy inputs (deposit spends no existing notes)
    const dummyInput1 = this.createDummyInput(privKeyBytes, pubKeyBytes);
    const dummyInput2 = this.createDummyInput(privKeyBytes, pubKeyBytes);
    const inputNotes = [dummyInput1, dummyInput2];

    // Create 2 output notes: full amount + zero dummy
    const output0 = this.createOutput(amountStroops, pubKeyBytes);
    const output1 = this.createOutput(0n, pubKeyBytes);
    const outputNotes = [output0, output1];

    // Encrypt outputs with user's own encryption key
    const encrypted0 = this.encryptOutput(output0, encryptionPubKey);
    const encrypted1 = this.encryptOutput(output1, encryptionPubKey);

    // Build ext data and hash
    const extData = {
      encrypted_output0: encrypted0,
      encrypted_output1: encrypted1,
      ext_amount: amountStroops,
      recipient: poolContractAddress,
    };
    const extDataHash = this.hashExtData(extData);

    // Public amount as field element
    const publicAmount = this.toFieldElement(amountStroops);

    // Assemble circuit inputs
    const circuitInputs: Record<string, any> = {
      // Public inputs
      root: bytesToBigIntLE(poolRoot).toString(),
      publicAmount: publicAmount.toString(),
      extDataHash: extDataHash.toString(),
      inputNullifier: inputNotes.map(n => n.nullifierBig.toString()),
      outputCommitment: outputNotes.map(n => n.commitmentBig.toString()),

      // ASP proofs (one per input note)
      membershipRoots: inputNotes.map(() => [membershipProof.root]),
      nonMembershipRoots: inputNotes.map(() => [nonMembershipProof.root]),
      membershipProofs: inputNotes.map(() => [membershipProof]),
      nonMembershipProofs: inputNotes.map(() => [nonMembershipProof]),

      // Private inputs: input notes
      inAmount: inputNotes.map(n => n.amount.toString()),
      inPrivateKey: inputNotes.map(() => privKeyBigInt.toString()),
      inBlinding: inputNotes.map(n => n.blinding.toString()),
      inPathIndices: inputNotes.map(n => n.pathIndices),
      inPathElements: inputNotes.map(n => n.pathElements),

      // Private inputs: output notes
      outAmount: outputNotes.map(n => n.amount.toString()),
      outPubkey: outputNotes.map(n => bytesToBigIntLE(n.pubKeyBytes).toString()),
      outBlinding: outputNotes.map(n => n.blinding.toString()),
    };

    return { circuitInputs, extData, outputNotes };
  }

  private createDummyInput(privKeyBytes: Uint8Array, pubKeyBytes: Uint8Array) {
    const amount = 0n;
    const blindingBytes = this.bridge.generateBlinding();
    const blinding = bytesToBigIntLE(blindingBytes);
    const amountBytes = this.bridge.bigintToField(amount);
    const pathIndicesBytes = this.bridge.bigintToField(0n);

    const commitment = this.bridge.computeCommitment(amountBytes, pubKeyBytes, blindingBytes);
    const signature = this.bridge.computeSignature(privKeyBytes, commitment, pathIndicesBytes);
    const nullifier = this.bridge.computeNullifier(commitment, pathIndicesBytes, signature);

    return {
      amount,
      blinding,
      nullifierBig: bytesToBigIntLE(nullifier),
      pathIndices: '0',
      pathElements: Array(POOL_TREE_DEPTH).fill('0'),
    };
  }

  private createOutput(amount: bigint, pubKeyBytes: Uint8Array) {
    const blindingBytes = this.bridge.generateBlinding();
    const blinding = bytesToBigIntLE(blindingBytes);
    const amountBytes = this.bridge.bigintToField(amount);
    const commitment = this.bridge.computeCommitment(amountBytes, pubKeyBytes, blindingBytes);

    return {
      amount,
      blinding,
      blindingBytes,
      pubKeyBytes,
      commitmentBytes: commitment,
      commitmentBig: bytesToBigIntLE(commitment),
    };
  }

  private encryptOutput(
    outputNote: { amount: bigint; blindingBytes: Uint8Array },
    encryptionPubKey: Uint8Array,
  ): Uint8Array {
    // Plaintext: 8 bytes amount (LE) + 32 bytes blinding = 40 bytes
    const plaintext = new Uint8Array(40);
    let amt = outputNote.amount;
    for (let i = 0; i < 8; i++) {
      plaintext[i] = Number(amt & 0xffn);
      amt >>= 8n;
    }
    plaintext.set(outputNote.blindingBytes, 8);

    return this.bridge.encryptNote(encryptionPubKey, plaintext);
  }

  private hashExtData(extData: {
    encrypted_output0: Uint8Array;
    encrypted_output1: Uint8Array;
    ext_amount: bigint;
    recipient: string;
  }): bigint {
    // Build Soroban XDR struct, fields sorted alphabetically
    const entries = [
      { key: 'encrypted_output0', val: xdr.ScVal.scvBytes(Buffer.from(extData.encrypted_output0)) },
      { key: 'encrypted_output1', val: xdr.ScVal.scvBytes(Buffer.from(extData.encrypted_output1)) },
      { key: 'ext_amount', val: new XdrLargeInt('i256', extData.ext_amount.toString()).toScVal() },
      { key: 'recipient', val: Address.fromString(extData.recipient).toScVal() },
    ];
    entries.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);

    const scEntries = entries.map(e => new xdr.ScMapEntry({
      key: xdr.ScVal.scvSymbol(e.key),
      val: e.val,
    }));
    const scVal = xdr.ScVal.scvMap(scEntries);
    const xdrBytes = new Uint8Array(scVal.toXDR());

    // Keccak256 hash, reduced modulo BN256
    const digest = keccak_256(xdrBytes);
    const digestBig = bytesToBigIntBE(digest);
    return digestBig % this.getBn256Mod();
  }

  private toFieldElement(amount: bigint): bigint {
    if (amount >= 0n) return amount;
    return this.getBn256Mod() + amount;
  }
}
