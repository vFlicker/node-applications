import { ChildProcess } from 'node:child_process';
import { Worker } from 'node:cluster';
import { randomUUID } from 'node:crypto';

import { DbProcessResponse, DbRequest, RequestId } from './types.js';

export class IPCManager {
  private databaseProcess: ChildProcess;
  private workerRequests = new Map<RequestId, Worker>();

  constructor(databaseProcess: ChildProcess) {
    this.databaseProcess = databaseProcess;

    this.databaseProcess.on(
      'message',
      (dbProcessResponse: DbProcessResponse) => {
        const serverWorker = this.workerRequests.get(
          dbProcessResponse.requestId,
        );
        if (!serverWorker) return;
        serverWorker.send(dbProcessResponse ?? null);
        this.workerRequests.delete(dbProcessResponse.requestId);
      },
    );
  }

  registerWorker(serverWorker: Worker): void {
    serverWorker.on('message', (dbRequest: DbRequest) => {
      const requestId = randomUUID();
      this.workerRequests.set(requestId, serverWorker);
      this.databaseProcess.send({ ...dbRequest, requestId });
    });
  }
}
