import { ChildProcess, Serializable } from 'node:child_process';
import { Worker } from 'node:cluster';

import { v4 as generateId } from 'uuid';

type Message = {
  requestId: string;
  data: Serializable;
};

export class IPCManager {
  private databaseProcess: ChildProcess;
  private workerRequests = new Map<string, Worker>();

  constructor(databaseProcess: ChildProcess) {
    this.databaseProcess = databaseProcess;

    this.databaseProcess.on('message', ({ requestId, data }: Message) => {
      const serverWorker = this.workerRequests.get(requestId);
      if (!serverWorker) return;
      serverWorker.send(data);
      this.workerRequests.delete(requestId);
    });
  }

  registerWorker(serverWorker: Worker) {
    serverWorker.on('message', (messageFromDbClient) => {
      const requestId = generateId();
      this.workerRequests.set(requestId, serverWorker);
      this.databaseProcess.send({ ...messageFromDbClient, requestId });
    });
  }
}
