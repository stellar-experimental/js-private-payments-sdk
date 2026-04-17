import { describe, it, expect } from 'vitest';
import { hexToBytes, normalizeU256 } from '../utils.js';

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

  it('converts full 32-byte hex', () => {
    const hex = 'aa'.repeat(32);
    const result = hexToBytes(hex);
    expect(result.length).toBe(32);
    expect(result.every(b => b === 0xaa)).toBe(true);
  });

  it('handles uppercase hex', () => {
    expect(hexToBytes('AABB')).toEqual(new Uint8Array([0xaa, 0xbb]));
  });

  it('handles mixed case hex', () => {
    expect(hexToBytes('aAbB')).toEqual(new Uint8Array([0xaa, 0xbb]));
  });
});

describe('normalizeU256', () => {
  it('pads short hex string to 64 chars', () => {
    expect(normalizeU256('0xff')).toBe('0x' + 'ff'.padStart(64, '0'));
  });

  it('handles no prefix', () => {
    expect(normalizeU256('aabb')).toBe('0x' + 'aabb'.padStart(64, '0'));
  });

  it('preserves full-length 64-char hex', () => {
    const full = 'a'.repeat(64);
    expect(normalizeU256('0x' + full)).toBe('0x' + full);
  });

  it('converts bigint zero', () => {
    expect(normalizeU256(0n)).toBe('0x' + '0'.repeat(64));
  });

  it('converts bigint', () => {
    expect(normalizeU256(255n)).toBe('0x' + 'ff'.padStart(64, '0'));
  });

  it('converts large bigint', () => {
    const big = (1n << 255n) - 1n;
    const result = normalizeU256(big);
    expect(result.startsWith('0x')).toBe(true);
    expect(result.length).toBe(66); // 0x + 64 chars
  });

  it('converts single byte Uint8Array', () => {
    expect(normalizeU256(new Uint8Array([0xff]))).toBe('0x' + 'ff'.padStart(64, '0'));
  });

  it('converts 32-byte Uint8Array', () => {
    const bytes = new Uint8Array(32).fill(0xab);
    const result = normalizeU256(bytes);
    expect(result).toBe('0x' + 'ab'.repeat(32));
  });

  it('converts empty Uint8Array', () => {
    expect(normalizeU256(new Uint8Array([]))).toBe('0x' + '0'.repeat(64));
  });

  it('throws on null', () => {
    expect(() => normalizeU256(null)).toThrow('null/undefined');
  });

  it('throws on undefined', () => {
    expect(() => normalizeU256(undefined)).toThrow('null/undefined');
  });

  it('throws on number type', () => {
    expect(() => normalizeU256(123)).toThrow('Unsupported U256 type');
  });

  it('throws on object type', () => {
    expect(() => normalizeU256({})).toThrow('Unsupported U256 type');
  });

  it('throws on hex string longer than 64 chars', () => {
    expect(() => normalizeU256('0x' + 'a'.repeat(65))).toThrow('too long');
  });

  it('throws on Uint8Array longer than 32 bytes', () => {
    expect(() => normalizeU256(new Uint8Array(33))).toThrow('too long');
  });

  it('throws on invalid hex characters', () => {
    expect(() => normalizeU256('0xggzz')).toThrow('invalid characters');
  });

  it('handles empty string', () => {
    expect(normalizeU256('')).toBe('0x' + '0'.repeat(64));
  });

  it('handles 0x only', () => {
    expect(normalizeU256('0x')).toBe('0x' + '0'.repeat(64));
  });
});
