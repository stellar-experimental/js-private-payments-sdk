import { STORE_KEYS, type StorageBackend, type StoreName } from './storage.js';

const DB_NAME = 'private-payments-sdk';
const DB_VERSION = 1;

export class IndexedDBStorage implements StorageBackend {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        for (const storeName of Object.keys(STORE_KEYS) as StoreName[]) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: STORE_KEYS[storeName] });
          }
        }
      };
      request.onsuccess = () => { this.db = request.result; resolve(); };
      request.onerror = () => reject(request.error);
    });
  }

  private getDb(): IDBDatabase {
    if (!this.db) throw new Error('IndexedDBStorage not initialized. Call init() first.');
    return this.db;
  }

  private tx(store: StoreName, mode: IDBTransactionMode): IDBObjectStore {
    return this.getDb().transaction(store, mode).objectStore(store);
  }

  private req<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(store: StoreName, key: any): Promise<any | undefined> {
    return this.req(this.tx(store, 'readonly').get(key));
  }

  async getAll(store: StoreName): Promise<any[]> {
    return this.req(this.tx(store, 'readonly').getAll());
  }

  async getAllByIndex(store: StoreName, index: string, value: any): Promise<any[]> {
    const all = await this.getAll(store);
    return all.filter(record => record[index] === value);
  }

  async put(store: StoreName, value: any): Promise<void> {
    await this.req(this.tx(store, 'readwrite').put(value));
  }

  async putAll(store: StoreName, values: any[]): Promise<void> {
    const tx = this.getDb().transaction(store, 'readwrite');
    const objectStore = tx.objectStore(store);
    for (const value of values) {
      objectStore.put(value);
    }
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async del(store: StoreName, key: any): Promise<void> {
    await this.req(this.tx(store, 'readwrite').delete(key));
  }

  async clear(store: StoreName): Promise<void> {
    await this.req(this.tx(store, 'readwrite').clear());
  }

  async clearAll(): Promise<void> {
    for (const storeName of Object.keys(STORE_KEYS) as StoreName[]) {
      await this.clear(storeName);
    }
  }

  async count(store: StoreName): Promise<number> {
    return this.req(this.tx(store, 'readonly').count());
  }

  async iterate(store: StoreName, callback: (value: any) => boolean | void): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = this.tx(store, 'readonly').openCursor();
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) { resolve(); return; }
        if (callback(cursor.value) === false) { resolve(); return; }
        cursor.continue();
      };
      request.onerror = () => reject(request.error);
    });
  }

  close(): void {
    this.db?.close();
    this.db = null;
  }
}
