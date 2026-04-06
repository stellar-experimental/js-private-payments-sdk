import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const artifactsDir = resolve(__dirname, '..', '..', 'artifacts');

describe('WASM smoke test', () => {
  it('prover WASM loads and version() returns a string', async () => {
    const wasmBytes = readFileSync(resolve(artifactsDir, 'prover_bg.wasm'));
    const prover = await import(resolve(artifactsDir, 'prover.js'));
    prover.initSync({ module: wasmBytes });

    const ver = prover.version();
    expect(typeof ver).toBe('string');
    expect(ver.length).toBeGreaterThan(0);
  });

  it('witness WASM loads', async () => {
    const wasmBytes = readFileSync(resolve(artifactsDir, 'witness_bg.wasm'));
    const witness = await import(resolve(artifactsDir, 'witness.js'));
    witness.initSync({ module: wasmBytes });

    const ver = witness.version();
    expect(typeof ver).toBe('string');
    expect(ver.length).toBeGreaterThan(0);
  });
});
