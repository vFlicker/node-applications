import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline';

export class ConsoleIO {
  #readline = createInterface({ input, output });

  /** @param {(line: string) => void} callback */
  onInput(callback) {
    this.#readline.on('line', callback);
  }

  close() {
    this.#readline.close();
  }

  /** @param {string} message */
  displayMessage(message) {
    console.log(message);
  }
}
