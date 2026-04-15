import { describe, it, expect } from 'vitest';
import { loadArtifact, defaultArtifactPath } from '../loader.js';

describe('loader', () => {
  it('loadArtifact returns Uint8Array passthrough', async () => {
    const bytes = new Uint8Array([1, 2, 3]);
    const result = await loadArtifact(bytes);
    expect(result).toBe(bytes);
  });

  it('loadArtifact reads file from path', async () => {
    const path = defaultArtifactPath('prover_bg.wasm');
    const result = await loadArtifact(path);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it('loadArtifact throws on missing file', async () => {
    await expect(loadArtifact('/nonexistent/file.bin')).rejects.toThrow();
  });

  it('defaultArtifactPath returns a path to artifacts dir', () => {
    const path = defaultArtifactPath('prover_bg.wasm');
    expect(path).toContain('artifacts');
    expect(path).toContain('prover_bg.wasm');
  });
});
