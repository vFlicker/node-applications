import { EntityId } from './types.js';

export interface Repository<T extends EntityId> {
  add(entity: Omit<T, 'id'>): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  delete(id: number): Promise<void>;
  update(id: number, updatedData: Partial<T>): Promise<T>;
}
