import { EntityNotFoundError } from '../errors.js';
import { Repository } from '../repository.interface.js';
import { EntityId } from '../types.js';

export class InMemoryRepository<T extends EntityId> implements Repository<T> {
  private data: T[] = [];
  private idCounter = 0;

  public async add(entity: Omit<T, 'id'>): Promise<T> {
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
