import cp from 'node:child_process';

import { v4 as generateId } from 'uuid';

export class IPCManager {
  #databaseProcess = null;
  #workerRequests = new Map();

  constructor(databasePath) {
    this.#databaseProcess = cp.fork(databasePath);

    this.#databaseProcess.on('message', ({ requestId, data }) => {
      const serverWorker = this.#workerRequests.get(requestId);
      if (!serverWorker) return;
      serverWorker.send(data);
      this.#workerRequests.delete(requestId);
    });
  }

  registerWorker(serverWorker) {
    serverWorker.on('message', (messageFromDbClient) => {
      const requestId = generateId();
      this.#workerRequests.set(requestId, serverWorker);
      this.#databaseProcess.send({ ...messageFromDbClient, requestId });
    });
  }
}
