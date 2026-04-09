import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { MemoryStorage } from '../memory.js';
import { FileSystemStorage } from '../filesystem.js';
import type { StorageBackend } from '../storage.js';

function runStorageTests(name: string, createStorage: () => StorageBackend, cleanup?: () => void) {
  describe(name, () => {
    let storage: StorageBackend;

    beforeEach(() => {
      storage = createStorage();
    });

    afterEach(() => {
      cleanup?.();
    });

    it('put and get roundtrip', async () => {
      await storage.put('user_notes', { id: 'note1', amount: '100', spent: false });
      const result = await storage.get('user_notes', 'note1');
      expect(result).toEqual({ id: 'note1', amount: '100', spent: false });
    });

    it('get returns undefined for missing key', async () => {
      const result = await storage.get('user_notes', 'nonexistent');
      expect(result).toBeUndefined();
    });

    it('put overwrites existing record', async () => {
      await storage.put('user_notes', { id: 'note1', amount: '100' });
      await storage.put('user_notes', { id: 'note1', amount: '200' });
      const result = await storage.get('user_notes', 'note1');
      expect(result.amount).toBe('200');
    });

    it('getAll returns all records', async () => {
      await storage.put('user_notes', { id: 'a', amount: '10' });
      await storage.put('user_notes', { id: 'b', amount: '20' });
      const results = await storage.getAll('user_notes');
      expect(results).toHaveLength(2);
    });

    it('getAllByIndex filters correctly', async () => {
      await storage.put('user_notes', { id: 'a', spent: false });
      await storage.put('user_notes', { id: 'b', spent: true });
      await storage.put('user_notes', { id: 'c', spent: false });
      const unspent = await storage.getAllByIndex('user_notes', 'spent', false);
      expect(unspent).toHaveLength(2);
    });

    it('putAll inserts multiple records', async () => {
      await storage.putAll('pool_leaves', [
        { index: 0, commitment: '0xaaa' },
        { index: 1, commitment: '0xbbb' },
        { index: 2, commitment: '0xccc' },
      ]);
      expect(await storage.count('pool_leaves')).toBe(3);
    });

    it('del removes a record', async () => {
      await storage.put('user_notes', { id: 'note1', amount: '100' });
      await storage.del('user_notes', 'note1');
      expect(await storage.get('user_notes', 'note1')).toBeUndefined();
    });

    it('clear empties a store', async () => {
      await storage.put('user_notes', { id: 'a' });
      await storage.put('user_notes', { id: 'b' });
      await storage.clear('user_notes');
      expect(await storage.count('user_notes')).toBe(0);
    });

    it('clearAll empties all stores', async () => {
      await storage.put('user_notes', { id: 'a' });
      await storage.put('pool_leaves', { index: 0, commitment: '0x1' });
      await storage.clearAll();
      expect(await storage.count('user_notes')).toBe(0);
      expect(await storage.count('pool_leaves')).toBe(0);
    });

    it('count returns correct number', async () => {
      expect(await storage.count('user_notes')).toBe(0);
      await storage.put('user_notes', { id: 'a' });
      expect(await storage.count('user_notes')).toBe(1);
    });

    it('iterate visits all records', async () => {
      await storage.put('user_notes', { id: 'a' });
      await storage.put('user_notes', { id: 'b' });
      const visited: string[] = [];
      await storage.iterate('user_notes', (v) => { visited.push(v.id); });
      expect(visited).toHaveLength(2);
    });

    it('iterate stops on false return', async () => {
      await storage.put('user_notes', { id: 'a' });
      await storage.put('user_notes', { id: 'b' });
      await storage.put('user_notes', { id: 'c' });
      const visited: string[] = [];
      await storage.iterate('user_notes', (v) => {
        visited.push(v.id);
        if (visited.length >= 2) return false;
      });
      expect(visited).toHaveLength(2);
    });

    it('stores are isolated from each other', async () => {
      await storage.put('user_notes', { id: 'note1' });
      await storage.put('pool_leaves', { index: 0, commitment: '0x1' });
      expect(await storage.count('user_notes')).toBe(1);
      expect(await storage.count('pool_leaves')).toBe(1);
      await storage.clear('user_notes');
      expect(await storage.count('pool_leaves')).toBe(1);
    });

    it('mutations to returned records do not affect storage', async () => {
      await storage.put('user_notes', { id: 'a', amount: '100' });
      const record = await storage.get('user_notes', 'a');
      record.amount = '999';
      const fresh = await storage.get('user_notes', 'a');
      expect(fresh.amount).toBe('100');
    });
  });
}

// Run against all backends
runStorageTests('MemoryStorage', () => new MemoryStorage());

let fsTmpDir: string;
runStorageTests(
  'FileSystemStorage',
  () => {
    fsTmpDir = mkdtempSync(join(tmpdir(), 'pps-test-'));
    return new FileSystemStorage(fsTmpDir);
  },
  () => rmSync(fsTmpDir, { recursive: true, force: true }),
);
