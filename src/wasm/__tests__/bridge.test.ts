import { describe, it, expect, beforeAll } from 'vitest';
import { WasmBridge } from '../bridge.js';

describe('WasmBridge', { timeout: 15_000 }, () => {
  let bridge: WasmBridge;

  beforeAll(async () => {
    bridge = new WasmBridge();
    await bridge.initialize();
  });

  it('reports ready after init', () => {
    expect(bridge.isReady()).toBe(true);
  });

  it('version() returns a string', () => {
    const ver = bridge.version();
    expect(typeof ver).toBe('string');
    expect(ver.length).toBeGreaterThan(0);
  });

  it('throws if used before initialize', () => {
    const uninit = new WasmBridge();
    expect(() => uninit.version()).toThrow('not initialized');
  });
});
