import { IPSClient } from './IPCClient.js';

export class DatabaseClient {
  #ipsClient = null;

  constructor(dbProcess = process) {
    this.#ipsClient = new IPSClient(dbProcess);
  }

  create(payload) {
    return this.#ipsClient.sendRequest('create', { ...payload });
  }

  findAll() {
    return this.#ipsClient.sendRequest('findAll');
  }

  findById(id) {
    return this.#ipsClient.sendRequest('findById', { id });
  }
}
