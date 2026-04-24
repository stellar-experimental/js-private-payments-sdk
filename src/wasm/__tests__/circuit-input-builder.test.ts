import { describe, it, expect, beforeAll } from 'vitest';
import { WasmBridge } from '../bridge.js';
import { CircuitInputBuilder } from '../circuit-input-builder.js';
import type { MembershipProofData, NonMembershipProofData } from '../../types.js';
import { POOL_TREE_DEPTH, ASP_TREE_DEPTH } from '../../utils.js';

describe('CircuitInputBuilder.buildDeposit', () => {
  let bridge: WasmBridge;
  let builder: CircuitInputBuilder;
  let privKeyBytes: Uint8Array;
  let pubKeyBytes: Uint8Array;
  let encryptionKeypair: { publicKey: Uint8Array; privateKey: Uint8Array };

  const fakeMembershipProof: MembershipProofData = {
    leaf: '123',
    blinding: '0',
    pathIndices: '0',
    pathElements: Array(POOL_TREE_DEPTH).fill('0'),
    root: '456',
  };

  const fakeNonMembershipProof: NonMembershipProofData = {
    key: '0',
    oldKey: '0',
    oldValue: '0',
    isOld0: '1',
    siblings: Array(ASP_TREE_DEPTH).fill('0'),
    root: '0',
  };

  beforeAll(async () => {
    bridge = new WasmBridge();
    await bridge.initialize();
    builder = new CircuitInputBuilder(bridge);

    // Derive test keys
    const fakeSig = new Uint8Array(64).fill(0xAB);
    privKeyBytes = bridge.deriveNotePrivateKey(fakeSig);
    pubKeyBytes = bridge.derivePublicKey(privKeyBytes);
    encryptionKeypair = bridge.deriveEncryptionKeypair(new Uint8Array(64).fill(0xCD));
  });

  it('returns circuitInputs, extData, and outputNotes', () => {
    const result = builder.buildDeposit({
      amountStroops: 100_0000000n,
      privKeyBytes,
      pubKeyBytes,
      encryptionPubKey: encryptionKeypair.publicKey,
      poolRoot: new Uint8Array(32).fill(0),
      membershipProof: fakeMembershipProof,
      nonMembershipProof: fakeNonMembershipProof,
      poolContractAddress: 'CA2TZYEXHGWWJJYYETDQBAUNJF7F2J4GVLDLW6LM5W32IIT4AO5SMPWQ',
    });

    expect(result.circuitInputs).toBeDefined();
    expect(result.extData).toBeDefined();
    expect(result.outputNotes).toHaveLength(2);
  });

  it('circuitInputs has all required fields', () => {
    const { circuitInputs } = builder.buildDeposit({
      amountStroops: 100_0000000n,
      privKeyBytes,
      pubKeyBytes,
      encryptionPubKey: encryptionKeypair.publicKey,
      poolRoot: new Uint8Array(32).fill(0),
      membershipProof: fakeMembershipProof,
      nonMembershipProof: fakeNonMembershipProof,
      poolContractAddress: 'CA2TZYEXHGWWJJYYETDQBAUNJF7F2J4GVLDLW6LM5W32IIT4AO5SMPWQ',
    });

    // Public inputs
    expect(circuitInputs.root).toBeDefined();
    expect(circuitInputs.publicAmount).toBeDefined();
    expect(circuitInputs.extDataHash).toBeDefined();
    expect(circuitInputs.inputNullifier).toHaveLength(2);
    expect(circuitInputs.outputCommitment).toHaveLength(2);

    // Private inputs
    expect(circuitInputs.inAmount).toHaveLength(2);
    expect(circuitInputs.inPrivateKey).toHaveLength(2);
    expect(circuitInputs.inBlinding).toHaveLength(2);
    expect(circuitInputs.inPathIndices).toHaveLength(2);
    expect(circuitInputs.inPathElements).toHaveLength(2);
    expect(circuitInputs.outAmount).toHaveLength(2);
    expect(circuitInputs.outPubkey).toHaveLength(2);
    expect(circuitInputs.outBlinding).toHaveLength(2);

    // ASP proofs
    expect(circuitInputs.membershipRoots).toHaveLength(2);
    expect(circuitInputs.nonMembershipRoots).toHaveLength(2);
    expect(circuitInputs.membershipProofs).toHaveLength(2);
    expect(circuitInputs.nonMembershipProofs).toHaveLength(2);
  });

  it('dummy inputs have zero amount', () => {
    const { circuitInputs } = builder.buildDeposit({
      amountStroops: 50_0000000n,
      privKeyBytes,
      pubKeyBytes,
      encryptionPubKey: encryptionKeypair.publicKey,
      poolRoot: new Uint8Array(32).fill(0),
      membershipProof: fakeMembershipProof,
      nonMembershipProof: fakeNonMembershipProof,
      poolContractAddress: 'CA2TZYEXHGWWJJYYETDQBAUNJF7F2J4GVLDLW6LM5W32IIT4AO5SMPWQ',
    });

    expect(circuitInputs.inAmount).toEqual(['0', '0']);
  });

  it('output notes have correct amounts', () => {
    const { outputNotes } = builder.buildDeposit({
      amountStroops: 50_0000000n,
      privKeyBytes,
      pubKeyBytes,
      encryptionPubKey: encryptionKeypair.publicKey,
      poolRoot: new Uint8Array(32).fill(0),
      membershipProof: fakeMembershipProof,
      nonMembershipProof: fakeNonMembershipProof,
      poolContractAddress: 'CA2TZYEXHGWWJJYYETDQBAUNJF7F2J4GVLDLW6LM5W32IIT4AO5SMPWQ',
    });

    expect(outputNotes[0].amount).toBe(50_0000000n);
    expect(outputNotes[1].amount).toBe(0n);
  });

  it('extData has positive ext_amount for deposit', () => {
    const { extData } = builder.buildDeposit({
      amountStroops: 100_0000000n,
      privKeyBytes,
      pubKeyBytes,
      encryptionPubKey: encryptionKeypair.publicKey,
      poolRoot: new Uint8Array(32).fill(0),
      membershipProof: fakeMembershipProof,
      nonMembershipProof: fakeNonMembershipProof,
      poolContractAddress: 'CA2TZYEXHGWWJJYYETDQBAUNJF7F2J4GVLDLW6LM5W32IIT4AO5SMPWQ',
    });

    expect(extData.ext_amount).toBe(100_0000000n);
    expect(extData.encrypted_output0).toBeInstanceOf(Uint8Array);
    expect(extData.encrypted_output1).toBeInstanceOf(Uint8Array);
    expect(extData.encrypted_output0.length).toBeGreaterThan(0);
    expect(extData.encrypted_output1.length).toBeGreaterThan(0);
  });

  it('random blindings produce different commitments across builds', () => {
    const r1 = builder.buildDeposit({
      amountStroops: 10n,
      privKeyBytes,
      pubKeyBytes,
      encryptionPubKey: encryptionKeypair.publicKey,
      poolRoot: new Uint8Array(32).fill(0),
      membershipProof: fakeMembershipProof,
      nonMembershipProof: fakeNonMembershipProof,
      poolContractAddress: 'CA2TZYEXHGWWJJYYETDQBAUNJF7F2J4GVLDLW6LM5W32IIT4AO5SMPWQ',
    });
    const r2 = builder.buildDeposit({
      amountStroops: 10n,
      privKeyBytes,
      pubKeyBytes,
      encryptionPubKey: encryptionKeypair.publicKey,
      poolRoot: new Uint8Array(32).fill(0),
      membershipProof: fakeMembershipProof,
      nonMembershipProof: fakeNonMembershipProof,
      poolContractAddress: 'CA2TZYEXHGWWJJYYETDQBAUNJF7F2J4GVLDLW6LM5W32IIT4AO5SMPWQ',
    });

    // Different blindings → different commitments
    expect(r1.outputNotes[0].commitmentBig).not.toBe(r2.outputNotes[0].commitmentBig);
  });
});
