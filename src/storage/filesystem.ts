import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { STORE_KEYS, type StorageBackend } from './storage.js';

export class FileSystemStorage implements StorageBackend {
  constructor(private dirPath: string) {
    mkdirSync(dirPath, { recursive: true });
  }

  private filePath(store: string): string {
    return join(this.dirPath, `${store}.json`);
  }

  private readStore(store: string): Record<string, any> {
    const path = this.filePath(store);
    if (!existsSync(path)) return {};
    return JSON.parse(readFileSync(path, 'utf-8'));
  }

  private writeStore(store: string, data: Record<string, any>): void {
    writeFileSync(this.filePath(store), JSON.stringify(data, null, 2));
  }

  private getKey(store: string, value: any): string {
    const keyField = STORE_KEYS[store];
    if (keyField && value && typeof value === 'object') {
      return String(value[keyField]);
    }
    return String(value?.id ?? value?.key ?? '');
  }

  async get(store: string, key: string): Promise<any | undefined> {
    const data = this.readStore(store);
    return data[String(key)] ? structuredClone(data[String(key)]) : undefined;
  }

  async getAll(store: string): Promise<any[]> {
    return Object.values(this.readStore(store)).map(v => structuredClone(v));
  }

  async getAllByIndex(store: string, index: string, value: any): Promise<any[]> {
    return Object.values(this.readStore(store))
      .filter(record => record[index] === value)
      .map(v => structuredClone(v));
  }

  async put(store: string, value: any): Promise<void> {
    const data = this.readStore(store);
    const key = this.getKey(store, value);
    data[key] = structuredClone(value);
    this.writeStore(store, data);
  }

  async putAll(store: string, values: any[]): Promise<void> {
    const data = this.readStore(store);
    for (const value of values) {
      const key = this.getKey(store, value);
      data[key] = structuredClone(value);
    }
    this.writeStore(store, data);
  }

  async del(store: string, key: string): Promise<void> {
    const data = this.readStore(store);
    delete data[String(key)];
    this.writeStore(store, data);
  }

  async clear(store: string): Promise<void> {
    this.writeStore(store, {});
  }

  async clearAll(): Promise<void> {
    for (const storeName of Object.keys(STORE_KEYS)) {
      const path = this.filePath(storeName);
      if (existsSync(path)) rmSync(path);
    }
  }

  async count(store: string): Promise<number> {
    return Object.keys(this.readStore(store)).length;
  }

  async iterate(store: string, callback: (value: any) => boolean | void): Promise<void> {
    for (const value of Object.values(this.readStore(store))) {
      if (callback(structuredClone(value)) === false) break;
    }
  }
}
