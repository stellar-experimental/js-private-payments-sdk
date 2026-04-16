import { describe, it, expect, beforeAll } from 'vitest';
import { WasmBridge } from '../bridge.js';
import { TREE_DEPTH } from '../../utils.js';

const FIELD_BYTES = 32;

describe('WasmBridge merkle tree', { timeout: 15_000 }, () => {
  let bridge: WasmBridge;

  beforeAll(async () => {
    bridge = new WasmBridge();
    await bridge.initialize();
  });

  it('createTree returns a tree object', () => {
    const tree = bridge.createTree(TREE_DEPTH);
    expect(tree).toBeDefined();
  });

  it('empty tree has root of 32 bytes', () => {
    const tree = bridge.createTree(TREE_DEPTH);
    const root = bridge.getRoot(tree);
    expect(root).toBeInstanceOf(Uint8Array);
    expect(root.length).toBe(FIELD_BYTES);
  });

  it('insertLeaf returns index starting from 0', () => {
    const tree = bridge.createTree(TREE_DEPTH);
    const leaf = new Uint8Array(FIELD_BYTES).fill(1);
    const idx = bridge.insertLeaf(tree, leaf);
    expect(idx).toBe(0);
  });

  it('insertLeaf increments index', () => {
    const tree = bridge.createTree(TREE_DEPTH);
    bridge.insertLeaf(tree, new Uint8Array(FIELD_BYTES).fill(1));
    const idx = bridge.insertLeaf(tree, new Uint8Array(FIELD_BYTES).fill(2));
    expect(idx).toBe(1);
  });

  it('root changes after insert', () => {
    const tree = bridge.createTree(TREE_DEPTH);
    const rootBefore = bridge.getRoot(tree);
    bridge.insertLeaf(tree, new Uint8Array(FIELD_BYTES).fill(1));
    const rootAfter = bridge.getRoot(tree);
    expect(rootBefore).not.toEqual(rootAfter);
  });

  it('getNextIndex tracks inserts', () => {
    const tree = bridge.createTree(TREE_DEPTH);
    expect(bridge.getNextIndex(tree)).toBe(0);
    bridge.insertLeaf(tree, new Uint8Array(FIELD_BYTES).fill(1));
    expect(bridge.getNextIndex(tree)).toBe(1);
    bridge.insertLeaf(tree, new Uint8Array(FIELD_BYTES).fill(2));
    expect(bridge.getNextIndex(tree)).toBe(2);
  });

  it('getProof returns pathElements, pathIndices, root', () => {
    const tree = bridge.createTree(TREE_DEPTH);
    bridge.insertLeaf(tree, new Uint8Array(FIELD_BYTES).fill(1));
    const proof = bridge.getProof(tree, 0);
    expect(proof.pathElements).toBeInstanceOf(Uint8Array);
    expect(proof.pathIndices).toBeInstanceOf(Uint8Array);
    expect(proof.root).toBeInstanceOf(Uint8Array);
    expect(proof.root.length).toBe(FIELD_BYTES);
  });

  it('proof root matches tree root', () => {
    const tree = bridge.createTree(TREE_DEPTH);
    bridge.insertLeaf(tree, new Uint8Array(FIELD_BYTES).fill(1));
    const proof = bridge.getProof(tree, 0);
    const root = bridge.getRoot(tree);
    expect(proof.root).toEqual(root);
  });

  it('same leaves in same order produce same root', () => {
    const tree1 = bridge.createTree(TREE_DEPTH);
    const tree2 = bridge.createTree(TREE_DEPTH);
    const leaf1 = new Uint8Array(FIELD_BYTES).fill(1);
    const leaf2 = new Uint8Array(FIELD_BYTES).fill(2);
    bridge.insertLeaf(tree1, leaf1);
    bridge.insertLeaf(tree1, leaf2);
    bridge.insertLeaf(tree2, leaf1);
    bridge.insertLeaf(tree2, leaf2);
    expect(bridge.getRoot(tree1)).toEqual(bridge.getRoot(tree2));
  });
});
