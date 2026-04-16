/**
 * Generic signing interface. Any wallet (Freighter, Lobstr, custom)
 * implements these 4 methods to integrate with the SDK.
 * The SDK never touches private keys directly.
 */
export interface Signer {
  getPublicKey(): Promise<string>;

  signTransaction(
    xdr: string,
    opts?: { networkPassphrase?: string },
  ): Promise<{ signedTxXdr: string; signerAddress: string }>;

  signAuthEntry(
    xdr: string,
    opts?: { networkPassphrase?: string },
  ): Promise<{ signedAuthEntry: string; signerAddress: string }>;

  /**
   * Sign an arbitrary message.
   * Used to derive BN254 spending keys and X25519 encryption keys.
   */
  signMessage(
    message: string,
    opts?: { networkPassphrase?: string },
  ): Promise<{ signedMessage: string; signerAddress: string }>;
}
