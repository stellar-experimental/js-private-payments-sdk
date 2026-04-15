import { describe, it, expect, vi, afterEach } from 'vitest';
import { loadArtifact, defaultArtifactPath } from '../loader.js';

describe('loader', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
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

  it('loadArtifact fetches from URL', async () => {
    const fakeBytes = new Uint8Array([10, 20, 30]);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(fakeBytes.buffer),
    }));

    const result = await loadArtifact('https://cdn.example.com/artifact.bin');
    expect(result).toEqual(fakeBytes);
    expect(fetch).toHaveBeenCalledWith('https://cdn.example.com/artifact.bin');
  });

  it('loadArtifact throws on non-OK fetch response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    }));

    await expect(loadArtifact('https://cdn.example.com/missing.bin'))
      .rejects.toThrow('Failed to fetch artifact');
  });
});
