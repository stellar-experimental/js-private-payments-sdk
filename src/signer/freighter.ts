import type { Signer } from './signer.js';
import {
  isConnected,
  isAllowed,
  setAllowed,
  requestAccess,
  signTransaction as freighterSignTransaction,
  signAuthEntry as freighterSignAuthEntry,
  signMessage as freighterSignMessage,
} from '@stellar/freighter-api';

export class FreighterSigner implements Signer {
  private async ensureReady(): Promise<void> {
    const conn = await isConnected();
    if (conn?.error || !conn?.isConnected) {
      throw new Error('Freighter not detected');
    }
    const allowed = await isAllowed();
    if (!allowed?.isAllowed) {
      const set = await setAllowed();
      if (set?.error) throw new Error(`Freighter access rejected: ${set.error}`);
    }
  }

  async getPublicKey(): Promise<string> {
    await this.ensureReady();
    const access = await requestAccess();
    if (access?.error || !access?.address) {
      throw new Error('Failed to get public key from Freighter');
    }
    return access.address;
  }

  async signTransaction(
    xdr: string,
    opts?: { networkPassphrase?: string },
  ): Promise<{ signedTxXdr: string; signerAddress: string }> {
    await this.ensureReady();
    const { signedTxXdr, signerAddress, error } = await freighterSignTransaction(xdr, opts);
    if (error) throw new Error(`Transaction signing failed: ${error}`);
    if (!signedTxXdr) throw new Error('No signed transaction returned');
    return { signedTxXdr, signerAddress };
  }

  async signAuthEntry(
    xdr: string,
    opts?: { networkPassphrase?: string },
  ): Promise<{ signedAuthEntry: string; signerAddress: string }> {
    await this.ensureReady();
    const { signedAuthEntry, signerAddress, error } = await freighterSignAuthEntry(xdr, opts);
    if (error) throw new Error(`Auth entry signing failed: ${error}`);
    if (!signedAuthEntry) throw new Error('No signed auth entry returned');
    return { signedAuthEntry, signerAddress };
  }

  async signMessage(
    message: string,
    opts?: { networkPassphrase?: string },
  ): Promise<{ signedMessage: string; signerAddress: string }> {
    await this.ensureReady();
    const { signedMessage, signerAddress, error } = await freighterSignMessage(message, opts ?? {});
    if (error) throw new Error(`Message signing failed: ${error}`);
    if (!signedMessage) throw new Error('No signature returned');
    return { signedMessage: String(signedMessage), signerAddress };
  }
}
