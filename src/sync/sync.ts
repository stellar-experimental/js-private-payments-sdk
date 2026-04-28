import type { StorageBackend } from '../storage/storage.js';
import type { RpcClient } from '../stellar/rpc-client.js';
import type { SyncResult } from '../types.js';
import type { PoolStore } from './pool-store.js';
import type { ASPMembershipStore } from './asp-membership-store.js';

/**
 * Fetch all new events since last sync and update local state.
 * 1. Read last synced ledger from storage
 * 2. Fetch pool events (commitments, nullifiers) since last sync
 * 3. Fetch ASP membership events since last sync
 * 4. Process events into stores
 * 5. Update sync cursor
 *
 * @param rpcClient - RPC client for fetching events
 * @param storage - Storage backend for sync metadata
 * @param poolStore - Pool commitment/nullifier store
 * @param aspMembershipStore - ASP membership store
 * @param poolAddress - Pool contract address
 * @param aspMembershipAddress - ASP Membership contract address
 * @returns Summary of what was synced
 */
export async function syncAll(
  rpcClient: RpcClient,
  storage: StorageBackend,
  poolStore: PoolStore,
  aspMembershipStore: ASPMembershipStore,
  poolAddress: string,
  aspMembershipAddress: string,
): Promise<SyncResult> {
  // Read last synced ledger
  const metadata = await storage.get('sync_metadata', poolAddress);
  const fromLedger = (metadata?.lastSyncedLedger ?? 0) + 1;

  // Fetch events in parallel
  const [poolEvents, aspEvents] = await Promise.all([
    rpcClient.fetchPoolEvents(poolAddress, fromLedger),
    rpcClient.fetchASPMembershipEvents(aspMembershipAddress, fromLedger),
  ]);

  // Process events into stores
  await poolStore.processCommitmentEvents(poolEvents.commitments);
  await poolStore.processNullifierEvents(poolEvents.nullifiers);
  await aspMembershipStore.processMembershipEvents(aspEvents.leaves);

  // Update sync cursor
  const toLedger = Math.min(poolEvents.latestLedger, aspEvents.latestLedger);
  await storage.put('sync_metadata', {
    pool: poolAddress,
    lastSyncedLedger: toLedger,
  });

  return {
    fromLedger,
    toLedger,
    newCommitments: poolEvents.commitments.length,
    newNullifiers: poolEvents.nullifiers.length,
    newMembershipLeaves: aspEvents.leaves.length,
  };
}
