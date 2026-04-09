import { STORE_KEYS, type StorageBackend } from './storage.js';

export class MemoryStorage implements StorageBackend {
  private stores = new Map<string, Map<string, any>>();

  private getStore(name: string): Map<string, any> {
    let store = this.stores.get(name);
    if (!store) {
      store = new Map();
      this.stores.set(name, store);
    }
    return store;
  }

  private getKey(storeName: string, value: any): string {
    const keyField = STORE_KEYS[storeName];
    if (keyField && value && typeof value === 'object') {
      return String(value[keyField]);
    }
    return String(value?.id ?? value?.key ?? '');
  }

  async get(store: string, key: string): Promise<any | undefined> {
    return structuredClone(this.getStore(store).get(String(key)));
  }

  async getAll(store: string): Promise<any[]> {
    return Array.from(this.getStore(store).values()).map(v => structuredClone(v));
  }

  async getAllByIndex(store: string, index: string, value: any): Promise<any[]> {
    const results: any[] = [];
    for (const record of this.getStore(store).values()) {
      if (record[index] === value) {
        results.push(structuredClone(record));
      }
    }
    return results;
  }

  async put(store: string, value: any): Promise<void> {
    const key = this.getKey(store, value);
    this.getStore(store).set(key, structuredClone(value));
  }

  async putAll(store: string, values: any[]): Promise<void> {
    for (const value of values) {
      await this.put(store, value);
    }
  }

  async del(store: string, key: string): Promise<void> {
    this.getStore(store).delete(String(key));
  }

  async clear(store: string): Promise<void> {
    this.getStore(store).clear();
  }

  async clearAll(): Promise<void> {
    this.stores.clear();
  }

  async count(store: string): Promise<number> {
    return this.getStore(store).size;
  }

  async iterate(store: string, callback: (value: any) => boolean | void): Promise<void> {
    for (const value of this.getStore(store).values()) {
      if (callback(structuredClone(value)) === false) break;
    }
  }
}
