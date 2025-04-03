import {
  EntityId,
  Payload,
  RecordEntity,
  Repository,
  RepositoryAction,
} from './types.js';

class EntityNotFoundError extends Error {
  constructor(id: number) {
    super(`Entity with id ${id} not found.`);
    this.name = 'EntityNotFoundError';
  }
}

class InMemoryRepository<T extends EntityId> implements Repository<T> {
  private data: T[] = [];
  private idCounter = 0;

  public async create(entity: Omit<T, 'id'>): Promise<T> {
    const id = (this.idCounter += 1);
    const newEntity = { ...entity, id } as T;
    this.data.push(newEntity);
    return newEntity;
  }

  public async findAll(): Promise<T[]> {
    return [...this.data];
  }

  public async findById({ id }: EntityId): Promise<T | null> {
    return this.data.find((item) => item.id === id) || null;
  }

  public async delete({ id }: EntityId): Promise<void> {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) this.data.splice(index, 1);
    else throw new EntityNotFoundError(id);
  }

  public async update({ id }: EntityId, updatedData: Partial<T>): Promise<T> {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      const updatedEntity = { ...this.data[index], ...updatedData } as T;
      this.data[index] = updatedEntity;
      return updatedEntity;
    } else {
      throw new EntityNotFoundError(id);
    }
  }
}

class InMemoryDatabase {
  private repositories = new Map<string, InMemoryRepository<RecordEntity>>();

  public getRepository<T extends EntityId>(entityName: string): Repository<T> {
    if (!this.repositories.has(entityName)) {
      const inMemoryRepository = new InMemoryRepository<T>();
      this.repositories.set(entityName, inMemoryRepository);
    }
    return this.repositories.get(entityName) as Repository<T>;
  }

  handleRequest<A extends RepositoryAction, T extends EntityId>(
    entityName: string,
    action: A,
    payload: Payload<A, T>,
  ) {
    const repository = this.getRepository(entityName);
    if (!repository || typeof repository[action] !== 'function') {
      throw new Error(`Unknown action: ${action} for entity: ${entityName}`);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return repository[action](...payload);
  }
}

const database = new InMemoryDatabase();

process.on('message', async ({ action, entityName, payload, requestId }) => {
  try {
    const result = await database.handleRequest(entityName, action, payload);
    process.send?.({ requestId, data: result });
  } catch (error) {
    process.send?.({ requestId, error });
  }
});
