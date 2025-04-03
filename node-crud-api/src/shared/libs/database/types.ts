import { ChildProcess } from 'node:child_process';

export type DbProcess = NodeJS.Process | ChildProcess;

export type EntityId = { id: number };
export type RecordEntity = EntityId & Record<string, unknown>;

export interface Repository<T extends EntityId> {
  create(entity: Omit<T, 'id'>): Promise<T>;
  findAll(): Promise<T[]>;
  findById({ id }: EntityId): Promise<T | null>;
  delete({ id }: EntityId): Promise<void>;
  update({ id }: EntityId, updatedData: Partial<T>): Promise<T>;
}

export type RepositoryAction = keyof Repository<EntityId>;

export type RepositoryPayloadMap<T extends EntityId> = {
  create: [entity: Omit<T, 'id'>];
  findAll: [];
  findById: [{ id: number }];
  delete: [{ id: number }];
  update: [{ id: number }, Partial<T>];
};

export type Payload<
  A extends RepositoryAction,
  T extends EntityId,
> = RepositoryPayloadMap<T>[A];

export interface Database {
  getRepository<T extends EntityId>(entityName: string): Repository<T>;
}
