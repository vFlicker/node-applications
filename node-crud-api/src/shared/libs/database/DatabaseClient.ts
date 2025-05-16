import { IPCClient } from './IPCClient.js';
import { Collection, CollectionName, DbProcess, EntityId } from './types.js';

export class DatabaseClient {
  private readonly ipsClient: IPCClient;

  constructor(dbProcess: DbProcess = process) {
    this.ipsClient = new IPCClient(dbProcess);
  }

  getCollection<T extends EntityId>(collection: CollectionName): Collection<T> {
    const { ipsClient } = this;

    return {
      create: (dto) => ipsClient.sendRequest(collection, 'create', dto),
      findAll: () => ipsClient.sendRequest(collection, 'findAll'),
      findById: (id) => ipsClient.sendRequest(collection, 'findById', id),
      update: (id, dto) => ipsClient.sendRequest(collection, 'update', id, dto),
      delete: (id) => ipsClient.sendRequest(collection, 'delete', id),
    } as Collection<T>;
  }
}
