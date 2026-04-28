/** Pool commitment Merkle tree depth. Must match circuit and contract deployment. */
export const POOL_TREE_DEPTH = 10;

/** ASP membership Merkle tree depth. Must match circuit and contract deployment. */
export const ASP_TREE_DEPTH = 10;

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (clean.length % 2 !== 0) throw new Error(`Hex string must have even length, got ${clean.length}`);
  if (clean.length > 0 && !/^[0-9a-fA-F]+$/.test(clean)) throw new Error('Hex string contains invalid characters');
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/** Convert little-endian bytes to bigint. */
export function bytesToBigIntLE(bytes: Uint8Array): bigint {
  let result = 0n;
  for (let i = bytes.length - 1; i >= 0; i--) {
    result = (result << 8n) | BigInt(bytes[i]);
  }
  return result;
}

/** Convert big-endian bytes to bigint. */
export function bytesToBigIntBE(bytes: Uint8Array): bigint {
  let result = 0n;
  for (let i = 0; i < bytes.length; i++) {
    result = (result << 8n) | BigInt(bytes[i]);
  }
  return result;
}

/** Normalize a U256 value (string, bigint, Uint8Array) to a 0x-prefixed 64-char hex string. */
export function normalizeU256(value: unknown): string {
  if (value === null || value === undefined) throw new Error('Cannot normalize null/undefined U256 value');
  if (typeof value === 'string') {
    const hex = value.startsWith('0x') ? value.slice(2) : value;
    if (hex.length > 64) throw new Error(`U256 hex string too long: ${hex.length} chars (max 64)`);
    if (hex.length > 0 && !/^[0-9a-fA-F]+$/.test(hex)) throw new Error('U256 hex string contains invalid characters');
    return '0x' + hex.padStart(64, '0');
  }
  if (typeof value === 'bigint') return '0x' + value.toString(16).padStart(64, '0');
  if (value instanceof Uint8Array) {
    if (value.length > 32) throw new Error(`U256 byte array too long: ${value.length} bytes (max 32)`);
    return '0x' + Array.from(value).map(b => b.toString(16).padStart(2, '0')).join('').padStart(64, '0');
  }
  throw new Error(`Unsupported U256 type: ${typeof value}`);
}
