import { DbProcess, EntityId, Payload, RepositoryAction } from './types.js';

export class IPCClient {
  private readonly dbProcess: DbProcess;

  constructor(childProcess: DbProcess = process) {
    this.dbProcess = childProcess;
  }

  sendRequest<A extends RepositoryAction, T extends EntityId>(
    entityName: string,
    action: A,
    ...payload: Payload<A, T>
  ) {
    return new Promise((resolve) => {
      this.dbProcess.once('message', (responseFromDbProcess) => {
        resolve(responseFromDbProcess);
      });

      this.dbProcess.send?.({ entityName, action, payload });
    });
  }
}
