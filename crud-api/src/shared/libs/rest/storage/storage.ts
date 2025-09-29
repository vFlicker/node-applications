import v8 from 'node:v8';

import { safeReadFile, safeUnlink, safeWriteFile } from './fileSystem.js';
import { createDirectoryIfNotExists, resolveDirPath } from './helpers.js';

export class InMemoryStorage<T> {
  private readonly cache = new Map<string, T>();
  private readonly dataStorageDirPath: string;

  constructor(dataStorageName: string) {
    this.dataStorageDirPath = resolveDirPath(dataStorageName);
    createDirectoryIfNotExists(dataStorageName);
  }

  public async get(key: string): Promise<T | null> {
    const value = this.cache.get(key);
    if (value) return value;

    const data = await safeReadFile(key, this.dataStorageDirPath);
    const deserializedValue: T = v8.deserialize(data as Uint8Array);
    this.cache.set(key, deserializedValue);
    return deserializedValue;
  }

  public async save(key: string): Promise<void> {
    const value = this.cache.get(key);
    if (!value) return;

    const data = v8.serialize(value);
    await safeWriteFile(key, this.dataStorageDirPath, data as Uint8Array);
  }

  public async delete(key: string): Promise<boolean> {
    await safeUnlink(key, this.dataStorageDirPath);
    return this.cache.delete(key);
  }

  public async set(key: string, value: T): Promise<void> {
    this.cache.set(key, value);
  }
}
