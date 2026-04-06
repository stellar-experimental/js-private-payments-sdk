/**
 * Groth16 proof structure for serialization to JS
 */
export class Groth16Proof {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Groth16Proof.prototype);
        obj.__wbg_ptr = ptr;
        Groth16ProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Groth16ProofFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_groth16proof_free(ptr, 0);
    }
    /**
     * Get proof point A as bytes
     * @returns {Uint8Array}
     */
    get a() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.groth16proof_a(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get proof point B as bytes
     * @returns {Uint8Array}
     */
    get b() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.groth16proof_b(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get proof point C as bytes
     * @returns {Uint8Array}
     */
    get c() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.groth16proof_c(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the full proof as concatenated bytes [A || B || C]
     * @returns {Uint8Array}
     */
    to_bytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.groth16proof_to_bytes(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) Groth16Proof.prototype[Symbol.dispose] = Groth16Proof.prototype.free;

/**
 * Merkle proof data returned to JavaScript
 */
export class MerkleProof {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MerkleProof.prototype);
        obj.__wbg_ptr = ptr;
        MerkleProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MerkleProofFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_merkleproof_free(ptr, 0);
    }
    /**
     * Get number of levels
     * @returns {number}
     */
    get levels() {
        const ret = wasm.merkleproof_levels(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get path elements as flat bytes (levels * 32 bytes)
     * @returns {Uint8Array}
     */
    get path_elements() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.merkleproof_path_elements(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get path indices as bytes (32 bytes)
     * @returns {Uint8Array}
     */
    get path_indices() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.merkleproof_path_indices(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get computed root as bytes (32 bytes)
     * @returns {Uint8Array}
     */
    get root() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.merkleproof_root(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) MerkleProof.prototype[Symbol.dispose] = MerkleProof.prototype.free;

/**
 * Simple Merkle tree for proof generation
 */
export class MerkleTree {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MerkleTree.prototype);
        obj.__wbg_ptr = ptr;
        MerkleTreeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MerkleTreeFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_merkletree_free(ptr, 0);
    }
    /**
     * Get tree depth
     * @returns {number}
     */
    get depth() {
        const ret = wasm.merkletree_depth(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get merkle proof for a leaf at given index
     * @param {number} index
     * @returns {MerkleProof}
     */
    get_proof(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.merkletree_get_proof(retptr, this.__wbg_ptr, index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return MerkleProof.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Insert a leaf and return its index
     * @param {Uint8Array} leaf_bytes
     * @returns {number}
     */
    insert(leaf_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(leaf_bytes, wasm.__wbindgen_export3);
            const len0 = WASM_VECTOR_LEN;
            wasm.merkletree_insert(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Create a new Merkle tree with given depth and default zero leaf (0)
     * @param {number} depth
     */
    constructor(depth) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.merkletree_new(retptr, depth);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            MerkleTreeFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Create a new Merkle tree with a custom zero leaf value.
     * This allows matching contract implementations that use non-zero empty
     * leaves (e.g., poseidon2("XLM") as the zero value).
     *
     * # Arguments
     * * `depth` - Tree depth (1-32)
     * * `zero_leaf_bytes` - Custom zero leaf value as 32 bytes (Little-Endian)
     * @param {number} depth
     * @param {Uint8Array} zero_leaf_bytes
     * @returns {MerkleTree}
     */
    static new_with_zero_leaf(depth, zero_leaf_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(zero_leaf_bytes, wasm.__wbindgen_export3);
            const len0 = WASM_VECTOR_LEN;
            wasm.merkletree_new_with_zero_leaf(retptr, depth, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return MerkleTree.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the next available leaf index
     * @returns {bigint}
     */
    get next_index() {
        const ret = wasm.merkletree_next_index(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get the current root
     * @returns {Uint8Array}
     */
    root() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.merkletree_root(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) MerkleTree.prototype[Symbol.dispose] = MerkleTree.prototype.free;

/**
 * Prover instance holding the loaded keys and R1CS
 */
export class Prover {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ProverFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_prover_free(ptr, 0);
    }
    /**
     * Get public inputs from witness
     *
     * Returns the public input portion of the witness as bytes
     * @param {Uint8Array} witness_bytes
     * @returns {Uint8Array}
     */
    extract_public_inputs(witness_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(witness_bytes, wasm.__wbindgen_export3);
            const len0 = WASM_VECTOR_LEN;
            wasm.prover_extract_public_inputs(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v2 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the serialized verifying key (for on-chain verification)
     * @returns {Uint8Array}
     */
    get_verifying_key() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.prover_get_verifying_key(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Create a new Prover instance from serialized keys and R1CS
     *
     * Uses unchecked deserialization since the proving key is trusted.
     * Skips curve point validation for faster initialization.
     *
     * # Arguments
     * * `pk_bytes` - Serialized proving key (compressed)
     * * `r1cs_bytes` - R1CS binary file contents
     * @param {Uint8Array} pk_bytes
     * @param {Uint8Array} r1cs_bytes
     */
    constructor(pk_bytes, r1cs_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(pk_bytes, wasm.__wbindgen_export3);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passArray8ToWasm0(r1cs_bytes, wasm.__wbindgen_export3);
            const len1 = WASM_VECTOR_LEN;
            wasm.prover_new(retptr, ptr0, len0, ptr1, len1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            ProverFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the number of constraints in the circuit
     * @returns {number}
     */
    get num_constraints() {
        const ret = wasm.prover_num_constraints(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the number of public inputs expected by this circuit
     * @returns {number}
     */
    get num_public_inputs() {
        const ret = wasm.prover_num_public_inputs(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the number of wires (variables) in the circuit
     * @returns {number}
     */
    get num_wires() {
        const ret = wasm.prover_num_wires(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Convert compressed proof bytes to uncompressed Soroban format.
     *
     * Input: compressed proof [A || B || C]
     * Output: uncompressed [A (64) || B (128) || C (64)] = 256 bytes
     * @param {Uint8Array} proof_bytes
     * @returns {Uint8Array}
     */
    proof_bytes_to_uncompressed(proof_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(proof_bytes, wasm.__wbindgen_export3);
            const len0 = WASM_VECTOR_LEN;
            wasm.prover_proof_bytes_to_uncompressed(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v2 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Generate a Groth16 proof from witness data
     *
     * # Arguments
     * * `witness_bytes` - Full witness as Little-Endian bytes (from witness
     *   calculator)
     *
     * # Returns
     * * Groth16Proof struct with proof points
     * @param {Uint8Array} witness_bytes
     * @returns {Groth16Proof}
     */
    prove(witness_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(witness_bytes, wasm.__wbindgen_export3);
            const len0 = WASM_VECTOR_LEN;
            wasm.prover_prove(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Groth16Proof.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Generate proof and return as concatenated bytes
     *
     * Format: [A (compressed G1) || B (compressed G2) || C (compressed G1)]
     * @param {Uint8Array} witness_bytes
     * @returns {Uint8Array}
     */
    prove_bytes(witness_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(witness_bytes, wasm.__wbindgen_export3);
            const len0 = WASM_VECTOR_LEN;
            wasm.prover_prove_bytes(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v2 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Generate proof and return as uncompressed bytes compatiblew with
     * Soroban.
     *
     * Format: [A (64 bytes) || B (128 bytes) || C (64 bytes)] = 256 bytes
     * G2 points use Soroban-compatible c1||c0 (imaginary||real) ordering.
     * @param {Uint8Array} witness_bytes
     * @returns {Uint8Array}
     */
    prove_bytes_uncompressed(witness_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(witness_bytes, wasm.__wbindgen_export3);
            const len0 = WASM_VECTOR_LEN;
            wasm.prover_prove_bytes_uncompressed(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v2 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Verify a proof (for testing purposes)
     * @param {Uint8Array} proof_bytes
     * @param {Uint8Array} public_inputs_bytes
     * @returns {boolean}
     */
    verify(proof_bytes, public_inputs_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(proof_bytes, wasm.__wbindgen_export3);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passArray8ToWasm0(public_inputs_bytes, wasm.__wbindgen_export3);
            const len1 = WASM_VECTOR_LEN;
            wasm.prover_verify(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return r0 !== 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) Prover.prototype[Symbol.dispose] = Prover.prototype.free;

/**
 * Result of SMT find operation
 */
export class WasmFindResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmFindResult.prototype);
        obj.__wbg_ptr = ptr;
        WasmFindResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmFindResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmfindresult_free(ptr, 0);
    }
    /**
     * Whether the key was found
     * @returns {boolean}
     */
    get found() {
        const ret = wasm.wasmfindresult_found(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get found value (if found)
     * @returns {Uint8Array}
     */
    get found_value() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmfindresult_found_value(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Whether the path ended at zero
     * @returns {boolean}
     */
    get is_old0() {
        const ret = wasm.wasmfindresult_is_old0(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get the key that was found at collision (if not found)
     * @returns {Uint8Array}
     */
    get not_found_key() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmfindresult_not_found_key(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the value at collision (if not found)
     * @returns {Uint8Array}
     */
    get not_found_value() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmfindresult_not_found_value(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get number of siblings
     * @returns {number}
     */
    get num_siblings() {
        const ret = wasm.wasmfindresult_num_siblings(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the current root
     * @returns {Uint8Array}
     */
    get root() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmfindresult_root(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get siblings as flat bytes
     * @returns {Uint8Array}
     */
    get siblings() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmfindresult_siblings(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) WasmFindResult.prototype[Symbol.dispose] = WasmFindResult.prototype.free;

/**
 * SMT Proof for circuit inputs
 */
export class WasmSMTProof {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmSMTProof.prototype);
        obj.__wbg_ptr = ptr;
        WasmSMTProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmSMTProofFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmsmtproof_free(ptr, 0);
    }
    /**
     * Whether the key was found
     * @returns {boolean}
     */
    get found() {
        const ret = wasm.wasmfindresult_found(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get found value
     * @returns {Uint8Array}
     */
    get found_value() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmfindresult_found_value(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Whether old value was zero
     * @returns {boolean}
     */
    get is_old0() {
        const ret = wasm.wasmfindresult_is_old0(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get not found key
     * @returns {Uint8Array}
     */
    get not_found_key() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmfindresult_not_found_key(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get not found value
     * @returns {Uint8Array}
     */
    get not_found_value() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmfindresult_not_found_value(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get number of siblings
     * @returns {number}
     */
    get num_siblings() {
        const ret = wasm.wasmfindresult_num_siblings(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get root
     * @returns {Uint8Array}
     */
    get root() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmfindresult_root(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get siblings as flat bytes (padded to max_levels)
     * @returns {Uint8Array}
     */
    get siblings() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmfindresult_siblings(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) WasmSMTProof.prototype[Symbol.dispose] = WasmSMTProof.prototype.free;

/**
 * Result of SMT operations (insert/update/delete)
 */
export class WasmSMTResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmSMTResult.prototype);
        obj.__wbg_ptr = ptr;
        WasmSMTResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmSMTResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmsmtresult_free(ptr, 0);
    }
    /**
     * Whether old value was zero
     * @returns {boolean}
     */
    get is_old0() {
        const ret = wasm.wasmsmtresult_is_old0(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get the new key
     * @returns {Uint8Array}
     */
    get new_key() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmsmtresult_new_key(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the new root after the operation
     * @returns {Uint8Array}
     */
    get new_root() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmsmtresult_new_root(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the new value
     * @returns {Uint8Array}
     */
    get new_value() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmsmtresult_new_value(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get number of siblings
     * @returns {number}
     */
    get num_siblings() {
        const ret = wasm.wasmsmtresult_num_siblings(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the old key
     * @returns {Uint8Array}
     */
    get old_key() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmsmtresult_old_key(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the old root before the operation
     * @returns {Uint8Array}
     */
    get old_root() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmsmtresult_old_root(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the old value
     * @returns {Uint8Array}
     */
    get old_value() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmsmtresult_old_value(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get siblings as flat bytes
     * @returns {Uint8Array}
     */
    get siblings() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmsmtresult_siblings(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) WasmSMTResult.prototype[Symbol.dispose] = WasmSMTResult.prototype.free;

/**
 * WASM-friendly Sparse Merkle Tree wrapper
 */
export class WasmSparseMerkleTree {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmSparseMerkleTreeFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmsparsemerkletree_free(ptr, 0);
    }
    /**
     * Find a key in the tree and get a membership/non-membership proof
     * @param {Uint8Array} key_bytes
     * @returns {WasmFindResult}
     */
    find(key_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(key_bytes, wasm.__wbindgen_export3);
            const len0 = WASM_VECTOR_LEN;
            wasm.wasmsparsemerkletree_find(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return WasmFindResult.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get a proof for a key, padded to max_levels
     * @param {Uint8Array} key_bytes
     * @param {number} max_levels
     * @returns {WasmSMTProof}
     */
    get_proof(key_bytes, max_levels) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(key_bytes, wasm.__wbindgen_export3);
            const len0 = WASM_VECTOR_LEN;
            wasm.wasmsparsemerkletree_get_proof(retptr, this.__wbg_ptr, ptr0, len0, max_levels);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return WasmSMTProof.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Insert a key-value pair into the tree
     *
     * # Arguments
     * * `key_bytes` - Key as 32 bytes (Little-Endian)
     * * `value_bytes` - Value as 32 bytes (Little-Endian)
     * @param {Uint8Array} key_bytes
     * @param {Uint8Array} value_bytes
     * @returns {WasmSMTResult}
     */
    insert(key_bytes, value_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(key_bytes, wasm.__wbindgen_export3);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passArray8ToWasm0(value_bytes, wasm.__wbindgen_export3);
            const len1 = WASM_VECTOR_LEN;
            wasm.wasmsparsemerkletree_insert(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return WasmSMTResult.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Create a new empty sparse merkle tree
     */
    constructor() {
        const ret = wasm.wasmsparsemerkletree_new();
        this.__wbg_ptr = ret >>> 0;
        WasmSparseMerkleTreeFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get the current root as bytes (32 bytes, Little-Endian)
     * @returns {Uint8Array}
     */
    root() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmsparsemerkletree_root(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Update a key's value in the tree
     * @param {Uint8Array} key_bytes
     * @param {Uint8Array} new_value_bytes
     * @returns {WasmSMTResult}
     */
    update(key_bytes, new_value_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(key_bytes, wasm.__wbindgen_export3);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passArray8ToWasm0(new_value_bytes, wasm.__wbindgen_export3);
            const len1 = WASM_VECTOR_LEN;
            wasm.wasmsparsemerkletree_update(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return WasmSMTResult.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
if (Symbol.dispose) WasmSparseMerkleTree.prototype[Symbol.dispose] = WasmSparseMerkleTree.prototype.free;

/**
 * Returns BN256 modulus as Big Endian bytes
 * @returns {Uint8Array}
 */
export function bn256_modulus() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.bn256_modulus(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Compute commitment: hash(amount, publicKey, blinding)
 *
 * Uses domain separation 0x01 for leaf commitments
 * @param {Uint8Array} amount
 * @param {Uint8Array} public_key
 * @param {Uint8Array} blinding
 * @returns {Uint8Array}
 */
export function compute_commitment(amount, public_key, blinding) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(amount, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(public_key, wasm.__wbindgen_export3);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray8ToWasm0(blinding, wasm.__wbindgen_export3);
        const len2 = WASM_VECTOR_LEN;
        wasm.compute_commitment(retptr, ptr0, len0, ptr1, len1, ptr2, len2);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v4 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Compute merkle root from leaves
 * @param {Uint8Array} leaves_bytes
 * @param {number} depth
 * @returns {Uint8Array}
 */
export function compute_merkle_root(leaves_bytes, depth) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(leaves_bytes, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.compute_merkle_root(retptr, ptr0, len0, depth);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Compute nullifier: hash(commitment, pathIndices, signature)
 *
 * Uses domain separation 0x02 for nullifiers
 * @param {Uint8Array} commitment
 * @param {Uint8Array} path_indices
 * @param {Uint8Array} signature
 * @returns {Uint8Array}
 */
export function compute_nullifier(commitment, path_indices, signature) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(commitment, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(path_indices, wasm.__wbindgen_export3);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray8ToWasm0(signature, wasm.__wbindgen_export3);
        const len2 = WASM_VECTOR_LEN;
        wasm.compute_nullifier(retptr, ptr0, len0, ptr1, len1, ptr2, len2);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v4 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Compute signature: hash(privateKey, commitment, merklePath)
 * @param {Uint8Array} private_key
 * @param {Uint8Array} commitment
 * @param {Uint8Array} merkle_path
 * @returns {Uint8Array}
 */
export function compute_signature(private_key, commitment, merkle_path) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(private_key, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(commitment, wasm.__wbindgen_export3);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray8ToWasm0(merkle_path, wasm.__wbindgen_export3);
        const len2 = WASM_VECTOR_LEN;
        wasm.compute_signature(retptr, ptr0, len0, ptr1, len1, ptr2, len2);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v4 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Standalone function to convert compressed proof to Soroban format.
 *
 * Input: compressed proof [A || B || C]
 * Output: uncompressed [A (64) || B (128) || C (64)] = 256 bytes
 * G2 points use Soroban-compatible c1||c0 ordering.
 * @param {Uint8Array} proof_bytes
 * @returns {Uint8Array}
 */
export function convert_proof_to_soroban(proof_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(proof_bytes, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.convert_proof_to_soroban(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Convert a decimal string to Little-Endian field element bytes
 * @param {string} decimal
 * @returns {Uint8Array}
 */
export function decimal_to_field_bytes(decimal) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(decimal, wasm.__wbindgen_export3, wasm.__wbindgen_export4);
        const len0 = WASM_VECTOR_LEN;
        wasm.decimal_to_field_bytes(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Decrypt note data using X25519-XSalsa20-Poly1305.
 *
 * When scanning for notes addressed to us, we try to decrypt each encrypted
 * output. If decryption succeeds, the note was sent to us.
 *
 * # Arguments
 * * `private_key_bytes` - Our X25519 encryption private key (32 bytes)
 * * `encrypted_data` - Encrypted data from on-chain event (112+ bytes)
 *
 * # Returns
 * - Success: `[amount (8 bytes LE)] [blinding (32 bytes)]` = 40 bytes
 * - Failure: Empty vec (note was not addressed to us)
 * @param {Uint8Array} private_key_bytes
 * @param {Uint8Array} encrypted_data
 * @returns {Uint8Array}
 */
export function decrypt_note_data(private_key_bytes, encrypted_data) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(private_key_bytes, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(encrypted_data, wasm.__wbindgen_export3);
        const len1 = WASM_VECTOR_LEN;
        wasm.decrypt_note_data(retptr, ptr0, len0, ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v3 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Encryption key derivation (X25519). Used for off-chain note
 * encryption/decryption Derive X25519 encryption keypair deterministically
 * from a Freighter signature.
 *
 * This keypair is used for encrypting note data (amount, blinding) so that
 * only the recipient can decrypt it. The encryption scheme is
 * X25519-XSalsa20-Poly1305.
 *
 * # Derivation
 * ```text
 * signature (64 bytes) → SHA-256 → 32-byte seed → X25519 keypair
 * ```
 *
 * # Arguments
 * * `signature` - Stellar Ed25519 signature from signing "Sign to access
 *   Privacy Pool [v1]"
 *
 * # Returns
 * 64 bytes: `[public_key (32), private_key (32)]`
 * @param {Uint8Array} signature
 * @returns {Uint8Array}
 */
export function derive_keypair_from_signature(signature) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(signature, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.derive_keypair_from_signature(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Derive private key (BN254 scalar) deterministically from a Freighter
 * signature for note identity. Used for ZK circuit ownership proofs
 *
 * This private key is used inside ZK circuits to prove ownership of notes.
 * The corresponding public key is derived via Poseidon2 hash
 *
 * # Derivation
 * ```text
 * signature (64 bytes) → SHA-256 → 32-byte BN254 scalar (note private key)
 * ```
 *
 * # Arguments
 * * `signature` - Stellar Ed25519 signature from signing "Privacy Pool
 *   Spending Key [v1]"
 *
 * # Returns
 * 32 bytes: Note private key (BN254 scalar, little-endian)
 * @param {Uint8Array} signature
 * @returns {Uint8Array}
 */
export function derive_note_private_key(signature) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(signature, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.derive_note_private_key(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Derive public key from private key
 *
 * publicKey = Poseidon2(privateKey, 0, domain=0x03)
 * @param {Uint8Array} private_key
 * @returns {Uint8Array}
 */
export function derive_public_key(private_key) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(private_key, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.derive_public_key(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Derive public key and return as hex string (for JS BigInt)
 * @param {Uint8Array} private_key
 * @returns {string}
 */
export function derive_public_key_hex(private_key) {
    let deferred3_0;
    let deferred3_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(private_key, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.derive_public_key_hex(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr2 = r0;
        var len2 = r1;
        if (r3) {
            ptr2 = 0; len2 = 0;
            throw takeObject(r2);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export2(deferred3_0, deferred3_1, 1);
    }
}

/**
 * Encrypt note data using X25519-XSalsa20-Poly1305 (NaCl crypto_box).
 *
 * When sending a note to someone, we encrypt the sensitive data (amount and
 * blinding) with their X25519 public key. Only they can decrypt it.
 *
 * # Output Format
 * ```text
 * [ephemeral_pubkey (32)] [nonce (24)] [ciphertext (40) + tag (16)]
 * Total: 112 bytes minimum
 * ```
 *
 * # Arguments
 * * `recipient_pubkey_bytes` - Recipient's X25519 encryption public key (32
 *   bytes)
 * * `plaintext` - Note data: `[amount (8 bytes LE)] [blinding (32 bytes)]` =
 *   40 bytes
 *
 * # Returns
 * Encrypted data (112 bytes)
 * @param {Uint8Array} recipient_pubkey_bytes
 * @param {Uint8Array} plaintext
 * @returns {Uint8Array}
 */
export function encrypt_note_data(recipient_pubkey_bytes, plaintext) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(recipient_pubkey_bytes, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(plaintext, wasm.__wbindgen_export3);
        const len1 = WASM_VECTOR_LEN;
        wasm.encrypt_note_data(retptr, ptr0, len0, ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v3 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Convert Little-Endian field bytes to hex string
 * @param {Uint8Array} bytes
 * @returns {string}
 */
export function field_bytes_to_hex(bytes) {
    let deferred3_0;
    let deferred3_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.field_bytes_to_hex(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr2 = r0;
        var len2 = r1;
        if (r3) {
            ptr2 = 0; len2 = 0;
            throw takeObject(r2);
        }
        deferred3_0 = ptr2;
        deferred3_1 = len2;
        return getStringFromWasm0(ptr2, len2);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export2(deferred3_0, deferred3_1, 1);
    }
}

/**
 * Generate a cryptographically random blinding factor for a note.
 *
 * Each note requires a unique blinding factor to ensure commitments are unique
 * even when amount and recipient are the same.
 *
 * # Returns
 * 32 bytes: Random BN254 scalar (little-endian), reduced to field modulus
 *
 * # Note
 * Unlike the private keys above, blinding factors are NOT derived
 * deterministically. They are random per-note and must be stored for later
 * use.
 * @returns {Uint8Array}
 */
export function generate_random_blinding() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generate_random_blinding(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Convert hex string to Little-Endian field bytes
 * @param {string} hex
 * @returns {Uint8Array}
 */
export function hex_to_field_bytes(hex) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_export3, wasm.__wbindgen_export4);
        const len0 = WASM_VECTOR_LEN;
        wasm.hex_to_field_bytes(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Initialize the WASM module
 * Sets up panic hook for better error messages in browser console
 */
export function init() {
    wasm.init();
}

/**
 * Parse witness bytes into vector of Fr elements
 *
 * Witness bytes are Little-Endian, 32 bytes per element
 * @param {Uint8Array} witness_bytes
 * @returns {Uint8Array}
 */
export function parse_witness(witness_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(witness_bytes, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.parse_witness(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Poseidon2 hash with 2 inputs as compression mode
 * @param {Uint8Array} input0
 * @param {Uint8Array} input1
 * @returns {Uint8Array}
 */
export function poseidon2_compression_wasm(input0, input1) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(input0, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(input1, wasm.__wbindgen_export3);
        const len1 = WASM_VECTOR_LEN;
        wasm.poseidon2_compression_wasm(retptr, ptr0, len0, ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v3 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Poseidon2 hash with 2 inputs and domain separation
 *
 * Matches the Circom Poseidon2(2) template
 * @param {Uint8Array} input0
 * @param {Uint8Array} input1
 * @param {number} domain_separation
 * @returns {Uint8Array}
 */
export function poseidon2_hash2(input0, input1, domain_separation) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(input0, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(input1, wasm.__wbindgen_export3);
        const len1 = WASM_VECTOR_LEN;
        wasm.poseidon2_hash2(retptr, ptr0, len0, ptr1, len1, domain_separation);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v3 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Compute Poseidon2 hash for leaf nodes: hash(key, value, 1)
 * @param {Uint8Array} key
 * @param {Uint8Array} value
 * @returns {Uint8Array}
 */
export function smt_hash_leaf(key, value) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(value, wasm.__wbindgen_export3);
        const len1 = WASM_VECTOR_LEN;
        wasm.smt_hash_leaf(retptr, ptr0, len0, ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v3 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Compute Poseidon2 compression hash of two field elements
 * @param {Uint8Array} left
 * @param {Uint8Array} right
 * @returns {Uint8Array}
 */
export function smt_hash_pair(left, right) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(left, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(right, wasm.__wbindgen_export3);
        const len1 = WASM_VECTOR_LEN;
        wasm.poseidon2_compression_wasm(retptr, ptr0, len0, ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v3 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Convert a u64 to Little-Endian field element bytes
 * @param {bigint} value
 * @returns {Uint8Array}
 */
export function u64_to_field_bytes(value) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.u64_to_field_bytes(retptr, value);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Standalone verification function
 * @param {Uint8Array} vk_bytes
 * @param {Uint8Array} proof_bytes
 * @param {Uint8Array} public_inputs_bytes
 * @returns {boolean}
 */
export function verify_proof(vk_bytes, proof_bytes, public_inputs_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(vk_bytes, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(proof_bytes, wasm.__wbindgen_export3);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray8ToWasm0(public_inputs_bytes, wasm.__wbindgen_export3);
        const len2 = WASM_VECTOR_LEN;
        wasm.verify_proof(retptr, ptr0, len0, ptr1, len1, ptr2, len2);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Get the module version
 * @returns {string}
 */
export function version() {
    let deferred1_0;
    let deferred1_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.version(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred1_0 = r0;
        deferred1_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export2(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Get the number of witness elements
 * @param {Uint8Array} witness_bytes
 * @returns {number}
 */
export function witness_element_count(witness_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(witness_bytes, wasm.__wbindgen_export3);
        const len0 = WASM_VECTOR_LEN;
        wasm.witness_element_count(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0 >>> 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Returns Zero leaf used in merkle trees as Big Endian bytes
 * @returns {Uint8Array}
 */
export function zero_leaf() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.zero_leaf(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export2(r0, r1 * 1, 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_is_function_0095a73b8b156f76: function(arg0) {
            const ret = typeof(getObject(arg0)) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_object_5ae8e5880f2c1fbd: function(arg0) {
            const val = getObject(arg0);
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        },
        __wbg___wbindgen_is_string_cd444516edc5b180: function(arg0) {
            const ret = typeof(getObject(arg0)) === 'string';
            return ret;
        },
        __wbg___wbindgen_is_undefined_9e4d92534c42d778: function(arg0) {
            const ret = getObject(arg0) === undefined;
            return ret;
        },
        __wbg___wbindgen_throw_be289d5034ed271b: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_call_389efe28435a9388: function() { return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        }, arguments); },
        __wbg_call_4708e0c13bdc8e95: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments); },
        __wbg_crypto_86f2631e91b51511: function(arg0) {
            const ret = getObject(arg0).crypto;
            return addHeapObject(ret);
        },
        __wbg_error_7534b8e9a36f1ab4: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_export2(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_getRandomValues_b3f15fcbfabb0f8b: function() { return handleError(function (arg0, arg1) {
            getObject(arg0).getRandomValues(getObject(arg1));
        }, arguments); },
        __wbg_length_32ed9a279acd054c: function(arg0) {
            const ret = getObject(arg0).length;
            return ret;
        },
        __wbg_msCrypto_d562bbe83e0d4b91: function(arg0) {
            const ret = getObject(arg0).msCrypto;
            return addHeapObject(ret);
        },
        __wbg_new_8a6f238a6ece86ea: function() {
            const ret = new Error();
            return addHeapObject(ret);
        },
        __wbg_new_no_args_1c7c842f08d00ebb: function(arg0, arg1) {
            const ret = new Function(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        },
        __wbg_new_with_length_a2c39cbe88fd8ff1: function(arg0) {
            const ret = new Uint8Array(arg0 >>> 0);
            return addHeapObject(ret);
        },
        __wbg_node_e1f24f89a7336c2e: function(arg0) {
            const ret = getObject(arg0).node;
            return addHeapObject(ret);
        },
        __wbg_process_3975fd6c72f520aa: function(arg0) {
            const ret = getObject(arg0).process;
            return addHeapObject(ret);
        },
        __wbg_prototypesetcall_bdcdcc5842e4d77d: function(arg0, arg1, arg2) {
            Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), getObject(arg2));
        },
        __wbg_randomFillSync_f8c153b79f285817: function() { return handleError(function (arg0, arg1) {
            getObject(arg0).randomFillSync(takeObject(arg1));
        }, arguments); },
        __wbg_require_b74f47fc2d022fd6: function() { return handleError(function () {
            const ret = module.require;
            return addHeapObject(ret);
        }, arguments); },
        __wbg_stack_0ed75d68575b0f3c: function(arg0, arg1) {
            const ret = getObject(arg1).stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export3, wasm.__wbindgen_export4);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_static_accessor_GLOBAL_12837167ad935116: function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_static_accessor_GLOBAL_THIS_e628e89ab3b1c95f: function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_static_accessor_SELF_a621d3dfbb60d0ce: function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_static_accessor_WINDOW_f8727f0cf888e0bd: function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addHeapObject(ret);
        },
        __wbg_subarray_a96e1fef17ed23cb: function(arg0, arg1, arg2) {
            const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
            return addHeapObject(ret);
        },
        __wbg_versions_4e31226f5e8dc909: function(arg0) {
            const ret = getObject(arg0).versions;
            return addHeapObject(ret);
        },
        __wbindgen_cast_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
            const ret = getArrayU8FromWasm0(arg0, arg1);
            return addHeapObject(ret);
        },
        __wbindgen_cast_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        },
        __wbindgen_object_clone_ref: function(arg0) {
            const ret = getObject(arg0);
            return addHeapObject(ret);
        },
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
    };
    return {
        __proto__: null,
        "./prover_bg.js": import0,
    };
}

const Groth16ProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_groth16proof_free(ptr >>> 0, 1));
const MerkleProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_merkleproof_free(ptr >>> 0, 1));
const MerkleTreeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_merkletree_free(ptr >>> 0, 1));
const ProverFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_prover_free(ptr >>> 0, 1));
const WasmFindResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmfindresult_free(ptr >>> 0, 1));
const WasmSMTProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmsmtproof_free(ptr >>> 0, 1));
const WasmSMTResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmsmtresult_free(ptr >>> 0, 1));
const WasmSparseMerkleTreeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmsparsemerkletree_free(ptr >>> 0, 1));

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getObject(idx) { return heap[idx]; }

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export(addHeapObject(e));
    }
}

let heap = new Array(128).fill(undefined);
heap.push(undefined, null, true, false);

let heap_next = heap.length;

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasm;
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('prover_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
