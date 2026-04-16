import { describe, it, expect } from 'vitest';
import { hexToBytes } from '../utils.js';

describe('hexToBytes', () => {
  it('converts hex string to bytes', () => {
    expect(hexToBytes('aabb')).toEqual(new Uint8Array([0xaa, 0xbb]));
  });

  it('handles 0x prefix', () => {
    expect(hexToBytes('0xaabb')).toEqual(new Uint8Array([0xaa, 0xbb]));
  });

  it('handles empty string', () => {
    expect(hexToBytes('')).toEqual(new Uint8Array([]));
  });

  it('handles 0x only', () => {
    expect(hexToBytes('0x')).toEqual(new Uint8Array([]));
  });

  it('throws on odd-length hex', () => {
    expect(() => hexToBytes('abc')).toThrow('even length');
  });

  it('throws on invalid characters', () => {
    expect(() => hexToBytes('ggzz')).toThrow('invalid characters');
  });
});
