import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@stellar/freighter-api', () => ({
  isConnected: vi.fn(),
  isAllowed: vi.fn(),
  setAllowed: vi.fn(),
  requestAccess: vi.fn(),
  signTransaction: vi.fn(),
  signAuthEntry: vi.fn(),
  signMessage: vi.fn(),
}));

import {
  isConnected,
  isAllowed,
  requestAccess,
  signTransaction,
  signAuthEntry,
  signMessage,
} from '@stellar/freighter-api';
import { FreighterSigner } from '../freighter.js';

const mockConnected = () => {
  vi.mocked(isConnected).mockResolvedValue({ isConnected: true } as any);
  vi.mocked(isAllowed).mockResolvedValue({ isAllowed: true } as any);
};

describe('FreighterSigner', () => {
  let signer: FreighterSigner;

  beforeEach(() => {
    vi.clearAllMocks();
    signer = new FreighterSigner();
    mockConnected();
  });

  it('getPublicKey returns address from Freighter', async () => {
    vi.mocked(requestAccess).mockResolvedValue({ address: 'GABC123' } as any);
    const key = await signer.getPublicKey();
    expect(key).toBe('GABC123');
  });

  it('getPublicKey throws when Freighter not detected', async () => {
    vi.mocked(isConnected).mockResolvedValue({ isConnected: false } as any);
    await expect(signer.getPublicKey()).rejects.toThrow('Freighter not detected');
  });

  it('signTransaction returns signed XDR', async () => {
    vi.mocked(signTransaction).mockResolvedValue({
      signedTxXdr: 'signed-xdr',
      signerAddress: 'GABC123',
    } as any);

    const result = await signer.signTransaction('unsigned-xdr', { networkPassphrase: 'Test' });
    expect(result.signedTxXdr).toBe('signed-xdr');
    expect(result.signerAddress).toBe('GABC123');
    expect(signTransaction).toHaveBeenCalledWith('unsigned-xdr', { networkPassphrase: 'Test' });
  });

  it('signTransaction throws on error', async () => {
    vi.mocked(signTransaction).mockResolvedValue({ error: 'user rejected' } as any);
    await expect(signer.signTransaction('xdr')).rejects.toThrow('Transaction signing failed');
  });

  it('signAuthEntry returns signed entry', async () => {
    vi.mocked(signAuthEntry).mockResolvedValue({
      signedAuthEntry: 'signed-auth',
      signerAddress: 'GABC123',
    } as any);

    const result = await signer.signAuthEntry('auth-xdr');
    expect(result.signedAuthEntry).toBe('signed-auth');
    expect(result.signerAddress).toBe('GABC123');
  });

  it('signAuthEntry throws on error', async () => {
    vi.mocked(signAuthEntry).mockResolvedValue({ error: 'denied' } as any);
    await expect(signer.signAuthEntry('xdr')).rejects.toThrow('Auth entry signing failed');
  });

  it('signMessage returns signed message', async () => {
    vi.mocked(signMessage).mockResolvedValue({
      signedMessage: 'deadbeef',
      signerAddress: 'GABC123',
    } as any);

    const result = await signer.signMessage('Privacy Pool Spending Key [v1]');
    expect(result.signedMessage).toBe('deadbeef');
    expect(result.signerAddress).toBe('GABC123');
  });

  it('signMessage throws when no signature returned', async () => {
    vi.mocked(signMessage).mockResolvedValue({
      signedMessage: null,
      signerAddress: 'GABC123',
    } as any);
    await expect(signer.signMessage('test')).rejects.toThrow('No signature returned');
  });
});
