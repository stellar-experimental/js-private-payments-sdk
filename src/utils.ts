/** Pool Merkle tree depth. Must match circuit and contract deployment. */
export const TREE_DEPTH = 10;

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

/** Normalize a U256 value (string, bigint) to a 0x-prefixed 64-char hex string. */
export function normalizeU256(value: any): string {
  if (value === null || value === undefined) throw new Error('Cannot normalize null/undefined U256 value');
  if (typeof value === 'string') {
    const hex = value.startsWith('0x') ? value.slice(2) : value;
    return '0x' + hex.padStart(64, '0');
  }
  if (typeof value === 'bigint') return '0x' + value.toString(16).padStart(64, '0');
  return String(value);
}
