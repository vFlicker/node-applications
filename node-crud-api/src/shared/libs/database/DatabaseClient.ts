import cp from 'node:child_process';

import { Repository } from './databaseProcess.js';

type EntityId = { id: number };

class IPSClient {
  private childProcess: NodeJS.Process | cp.ChildProcess;

  constructor(childProcess: NodeJS.Process | cp.ChildProcess = process) {
    this.childProcess = childProcess;
  }

  sendRequest(entityName: string, action: unknown, payload: unknown) {
    return new Promise((resolve) => {
      const messageForDbProcess = { entityName, action, payload };
      this.childProcess.send?.(messageForDbProcess);

      this.childProcess.once('message', (responseFromDbProcess) => {
        resolve(responseFromDbProcess);
      });
    });
  }
}

export class DatabaseClient {
  private ipsClient: IPSClient;

  constructor(dbProcess: NodeJS.Process | cp.ChildProcess = process) {
    this.ipsClient = new IPSClient(dbProcess);
  }

  getRepository<T extends EntityId>(entityName: string) {
    return {
      create: (dto) =>
        this.ipsClient.sendRequest(entityName, 'create', { dto }),
      findAll: () => this.ipsClient.sendRequest(entityName, 'findAll', {}),
      findById: (id) => this.ipsClient.sendRequest(entityName, 'findById', id),
      update: (id, dto) =>
        this.ipsClient.sendRequest(entityName, 'update', { id, dto }),
      delete: (id) => this.ipsClient.sendRequest(entityName, 'delete', { id }),
    } as Repository<T>;
  }
}
