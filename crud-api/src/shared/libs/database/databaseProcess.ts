import { randomUUID } from 'node:crypto';

import {
  Collection,
  CollectionAction,
  CollectionName,
  DbProcessResponse,
  EntityId,
  Payload,
  RecordEntity,
  WorkerMessage,
} from './types.js';

class EntityNotFoundError extends Error {
  constructor(id: EntityId['id']) {
    super(`Entity with id ${id} not found.`);
    this.name = 'EntityNotFoundError';
  }
}

class InMemoryCollection<T extends EntityId> implements Collection<T> {
  private data: T[] = [];

  public async create(entity: Omit<T, 'id'>): Promise<T> {
    const id = randomUUID();
    const newEntity = { ...entity, id } as T;
    this.data.push(newEntity);
    return newEntity;
  }

  public async findAll(): Promise<T[]> {
    return this.data;
  }

  public async findById({ id }: EntityId): Promise<T | null> {
    return this.data.find((item) => item.id === id) || null;
  }

  public async delete({ id }: EntityId): Promise<void> {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) this.data.splice(index, 1);
    throw new EntityNotFoundError(id);
  }

  public async update({ id }: EntityId, updatedData: Partial<T>): Promise<T> {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      const updatedEntity = { ...this.data[index], ...updatedData } as T;
      this.data[index] = updatedEntity;
      return updatedEntity;
    }

    throw new EntityNotFoundError(id);
  }
}

class InMemoryDatabase {
  private collection = new Map<
    CollectionName,
    InMemoryCollection<RecordEntity>
  >();

  public getCollection<T extends EntityId>(
    name: CollectionName,
  ): Collection<T> {
    if (!this.collection.has(name)) {
      const inMemoryCollection = new InMemoryCollection<T>();
      this.collection.set(name, inMemoryCollection);
    }

    return this.collection.get(name) as Collection<T>;
  }

  handleRequest<A extends CollectionAction, T extends EntityId>(
    collectionName: CollectionName,
    action: A,
    payload: Payload<A, T>,
  ) {
    const collection = this.getCollection(collectionName);
    if (!collection) {
      throw new Error(`Collection ${collectionName} not found.`);
    }

    const method = collection[action] as (
      ...args: Payload<A, T>
    ) => ReturnType<Collection<T>[A]>;

    return method.apply(collection, payload);
  }
}

const database = new InMemoryDatabase();

process.on(
  'message',
  async ({ collection, action, payload, requestId }: WorkerMessage) => {
    try {
      const data = await database.handleRequest(collection, action, payload);

      process.send?.({ requestId, data } as DbProcessResponse);
    } catch (error) {
      process.send?.({ requestId, data: error } as DbProcessResponse);
    }
  },
);
