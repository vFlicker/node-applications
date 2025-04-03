import { IPCClient } from './IPCClient.js';
import { DbProcess, EntityId, Repository } from './types.js';

export class DatabaseClient {
  private readonly ipsClient: IPCClient;

  constructor(dbProcess: DbProcess = process) {
    this.ipsClient = new IPCClient(dbProcess);
  }

  getRepository<T extends EntityId>(entityName: string) {
    const { ipsClient } = this;

    return {
      create: (dto) => ipsClient.sendRequest(entityName, 'create', dto),
      findAll: () => ipsClient.sendRequest(entityName, 'findAll'),
      findById: (id) => ipsClient.sendRequest(entityName, 'findById', id),
      update: (id, dto) => ipsClient.sendRequest(entityName, 'update', id, dto),
      delete: (id) => ipsClient.sendRequest(entityName, 'delete', id),
    } as Repository<T>;
  }
}
