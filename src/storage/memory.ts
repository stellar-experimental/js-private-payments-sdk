import { STORE_KEYS, type StorageBackend, type StoreName } from './storage.js';

export class MemoryStorage implements StorageBackend {
  private stores = new Map<string, Map<any, any>>();

  async init(): Promise<void> {}

  private getStore(name: StoreName): Map<any, any> {
    let store = this.stores.get(name);
    if (!store) {
      store = new Map();
      this.stores.set(name, store);
    }
    return store;
  }

  private getKey(storeName: StoreName, value: any): any {
    const keyField = STORE_KEYS[storeName];
    const key = value?.[keyField];
    if (key === undefined || key === null) throw new Error(`Missing key field '${keyField}' in value for store '${storeName}'`);
    return key;
  }

  async get(store: StoreName, key: any): Promise<any | undefined> {
    return structuredClone(this.getStore(store).get(key));
  }

  async getAll(store: StoreName): Promise<any[]> {
    return Array.from(this.getStore(store).values()).map(v => structuredClone(v));
  }

  async getAllByIndex(store: StoreName, index: string, value: any): Promise<any[]> {
    const results: any[] = [];
    for (const record of this.getStore(store).values()) {
      if (record[index] === value) {
        results.push(structuredClone(record));
      }
    }
    return results;
  }

  async put(store: StoreName, value: any): Promise<void> {
    const key = this.getKey(store, value);
    this.getStore(store).set(key, structuredClone(value));
  }

  async putAll(store: StoreName, values: any[]): Promise<void> {
    for (const value of values) {
      await this.put(store, value);
    }
  }

  async del(store: StoreName, key: any): Promise<void> {
    this.getStore(store).delete(key);
  }

  async clear(store: StoreName): Promise<void> {
    this.getStore(store).clear();
  }

  async clearAll(): Promise<void> {
    this.stores.clear();
  }

  async count(store: StoreName): Promise<number> {
    return this.getStore(store).size;
  }

  async iterate(store: StoreName, callback: (value: any) => boolean | void): Promise<void> {
    for (const value of this.getStore(store).values()) {
      if (callback(structuredClone(value)) === false) break;
    }
  }
}
