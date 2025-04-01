export class IPSClient {
  #childProcess = null;

  constructor(childProcess) {
    this.#childProcess = childProcess;
  }

  sendRequest(entityName, action, payload) {
    return new Promise((resolve) => {
      const messageForDbProcess = { entityName, action, payload };
      this.#childProcess.send(messageForDbProcess);

      this.#childProcess.once('message', (responseFromDbProcess) => {
        resolve(responseFromDbProcess);
      });
    });
  }
}
