import { Database } from '../database.interface.js';
import { Repository } from '../repository.interface.js';
import { EntityId, RecordEntity } from '../types.js';
import { InMemoryRepository } from './in-memory-repository.js';

export class InMemoryDatabase implements Database {
  private repositories = new Map<string, InMemoryRepository<RecordEntity>>();

  public getRepository<T extends EntityId>(entityName: string): Repository<T> {
    if (!this.repositories.has(entityName)) {
      const inMemoryRepository = new InMemoryRepository<T>();
      this.repositories.set(entityName, inMemoryRepository);
    }
    return this.repositories.get(entityName) as Repository<T>;
  }
}
