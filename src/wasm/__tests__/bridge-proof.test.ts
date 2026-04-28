import { describe, it, expect, beforeAll } from 'vitest';
import { WasmBridge } from '../bridge.js';

describe('WasmBridge proof', () => {
  let bridge: WasmBridge;

  beforeAll(async () => {
    bridge = new WasmBridge();
    await bridge.initialize();
  });

  it('prove throws on invalid circuit inputs', () => {
    expect(() => bridge.prove({ invalid: 'inputs' })).toThrow();
  });
});
