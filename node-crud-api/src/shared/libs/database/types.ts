export type EntityId = { id: number };
export type RecordEntity = EntityId & Record<string, unknown>;

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
