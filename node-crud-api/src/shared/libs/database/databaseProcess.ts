/* eslint-disable @typescript-eslint/no-explicit-any */
type EntityId = { id: number };
type RecordEntity = EntityId & Record<string, unknown>;

export interface Repository<T extends EntityId> {
  create(entity: Omit<T, 'id'>): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  delete(id: number): Promise<void>;
  update(id: number, updatedData: Partial<T>): Promise<T>;
}

export interface Database {
  getRepository<T extends EntityId>(entityName: string): Repository<T>;
}

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

  public async findById(id: number): Promise<T | null> {
    return this.data.find((item) => item.id === id) || null;
  }

  public async delete(id: number): Promise<void> {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) this.data.splice(index, 1);
    else throw new EntityNotFoundError(id);
  }

  public async update(id: number, updatedData: Partial<T>): Promise<T> {
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

// type Handler = {
//   action: 'create' | 'findAll' | 'findById' | 'delete' | 'update';
//   entityName: string;
//   [key: string]: unknown;
// };

class InMemoryDatabase {
  private repositories = new Map<string, InMemoryRepository<RecordEntity>>();

  public getRepository<T extends EntityId>(entityName: string): Repository<T> {
    if (!this.repositories.has(entityName)) {
      const inMemoryRepository = new InMemoryRepository<T>();
      this.repositories.set(entityName, inMemoryRepository);
    }
    return this.repositories.get(entityName) as Repository<T>;
  }

  handleRequest({ action, entityName, ...payload }: any) {
    const repository: any = this.getRepository(entityName);
    if (!repository || typeof repository[action] !== 'function') {
      throw new Error(`Unknown action: ${action} for entity: ${entityName}`);
    }

    return repository[action](...Object.values(payload));
  }
}

const database = new InMemoryDatabase();

process.on('message', async ({ action, entityName, payload, requestId }) => {
  try {
    const result = await database.handleRequest({
      action,
      entityName,
      ...payload,
    });
    process.send?.({ requestId, data: result });
  } catch (error) {
    process.send?.({ requestId, error });
  }
});
