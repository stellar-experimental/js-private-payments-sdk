import { fileURLToPath } from 'node:url';

/** Load a binary artifact from a file path, URL, or return existing bytes. */
export async function loadArtifact(source: string | Uint8Array): Promise<Uint8Array> {
  if (source instanceof Uint8Array) return source;

  if (typeof globalThis.fetch === 'function' && source.startsWith('http')) {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`Failed to fetch artifact: ${source} (${response.status})`);
    return new Uint8Array(await response.arrayBuffer());
  }

  // Lazy import node:fs to avoid breaking browser bundles
  const { readFileSync } = await import('node:fs');
  return readFileSync(source);
}

const ARTIFACTS_DIR = '../../artifacts';

export function defaultArtifactPath(filename: string): string {
  const url = new URL(`${ARTIFACTS_DIR}/${filename}`, import.meta.url);
  return fileURLToPath(url);
}
