import {
  CollectionAction,
  CollectionName,
  DbProcess,
  EntityId,
  Payload,
} from './types.js';

export class IPCClient {
  private readonly dbProcess: DbProcess;

  constructor(childProcess: DbProcess = process) {
    this.dbProcess = childProcess;
  }

  sendRequest<A extends CollectionAction, T extends EntityId>(
    collection: CollectionName,
    action: A,
    ...payload: Payload<A, T>
  ): Promise<unknown> {
    return new Promise((resolve) => {
      this.dbProcess.once('message', (dbResponse) => resolve(dbResponse));
      this.dbProcess.send?.({ collection, action, payload });
    });
  }
}
