import { describe, it, expect } from 'vitest';
import { WasmBridge } from '../bridge.js';

describe('WasmBridge', { timeout: 15_000 }, () => {
  it('initializes and reports ready', async () => {
    const bridge = new WasmBridge();
    expect(bridge.isReady()).toBe(false);
    await bridge.initialize();
    expect(bridge.isReady()).toBe(true);
  });

  it('version() returns a string after init', async () => {
    const bridge = new WasmBridge();
    await bridge.initialize();
    const ver = bridge.version();
    expect(typeof ver).toBe('string');
    expect(ver.length).toBeGreaterThan(0);
  });

  it('throws if used before initialize', () => {
    const bridge = new WasmBridge();
    expect(() => bridge.version()).toThrow('not initialized');
  });
});
