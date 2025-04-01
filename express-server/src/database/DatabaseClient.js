import { IPSClient } from './IPCClient.js';

export class DatabaseClient {
  #ipsClient = null;

  constructor(dbProcess = process) {
    this.#ipsClient = new IPSClient(dbProcess);
  }

  getRepository(entityName) {
    return {
      create: (dto) =>
        this.#ipsClient.sendRequest(entityName, 'create', { dto }),
      findAll: () => this.#ipsClient.sendRequest(entityName, 'findAll'),
      findById: (id) => this.#ipsClient.sendRequest(entityName, 'findById', id),
      update: (id, dto) =>
        this.#ipsClient.sendRequest(entityName, 'update', { id, dto }),
      delete: (id) => this.#ipsClient.sendRequest(entityName, 'delete', { id }),
    };
  }
}
