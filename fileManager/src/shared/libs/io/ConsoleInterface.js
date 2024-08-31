import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline';

export class ConsoleIO {
  #readline = createInterface({
    input: stdin,
    output: stdout,
    prompt: '> ',
  });

  /** @param {(line: string) => void} callback */
  onInput(callback) {
    this.#readline.on('line', callback);
  }

  /** @param {string} message */
  displayMessage(message) {
    console.log(message);
  }

  startPrompting() {
    this.#readline.prompt();
  }

  close() {
    this.#readline.close();
  }
}
