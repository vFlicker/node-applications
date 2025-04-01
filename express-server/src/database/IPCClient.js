export class IPSClient {
  #childProcess = null;

  constructor(childProcess) {
    this.#childProcess = childProcess;
  }

  sendRequest(action, payload = null) {
    return new Promise((resolve) => {
      const messageForDbProcess = { action, payload };
      this.#childProcess.send(messageForDbProcess);

      this.#childProcess.once('message', (responseFromDbProcess) => {
        resolve(responseFromDbProcess);
      });
    });
  }
}
