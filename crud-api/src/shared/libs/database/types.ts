import { ChildProcess, Serializable } from 'node:child_process';

export type DbProcess = NodeJS.Process | ChildProcess;

export interface Database {
  getCollection<T extends EntityId>(collection: CollectionName): Collection<T>;
}

export type EntityId = { id: string };
export type RecordEntity = EntityId & Record<string, unknown>;

export interface Collection<T extends EntityId> {
  create(entity: Omit<T, 'id'>): Promise<T>;
  findAll(): Promise<T[]>;
  findById({ id }: EntityId): Promise<T | null>;
  delete({ id }: EntityId): Promise<void>;
  update({ id }: EntityId, updatedData: Partial<T>): Promise<T>;
}

export type CollectionName = string;
export type CollectionAction = keyof Collection<EntityId>;

type CollectionPayloadMap<T extends EntityId> = {
  create: [entity: Omit<T, 'id'>];
  findAll: [];
  findById: [{ id: string }];
  delete: [{ id: string }];
  update: [{ id: string }, Partial<T>];
};

export type Payload<
  A extends CollectionAction,
  T extends EntityId,
> = CollectionPayloadMap<T>[A];

export type DbRequest = {
  collection: CollectionName;
  action: CollectionAction;
  payload: Payload<CollectionAction, RecordEntity>;
};

export type RequestId = string;

export type WorkerMessage = DbRequest & {
  requestId: RequestId;
};

export type DbResponse = {
  requestId: RequestId;
  data: Serializable;
};
