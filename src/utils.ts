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
