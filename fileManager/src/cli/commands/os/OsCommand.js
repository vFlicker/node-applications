import { arch, cpus, EOL, homedir, userInfo } from 'node:os';

import { InvalidInputError } from '#src/shared/Errors/InvalidInputError.js';

import { AbstractCommand } from '../AbstractCommand.js';

export class OsCommand extends AbstractCommand {
  getName() {
    return 'os';
  }

  /** @param {string} flag */
  async execute(flag) {
    if (!flag) throw new InvalidInputError();
    const flagHandler = this.flagHandlers[flag];
    if (!flagHandler) throw new InvalidInputError();
    flagHandler();
  }

  /** @type {Record<string, () => void>} */
  flagHandlers = {
    '--EOL': () => this.#eolHandler(),
    '--cpus': () => this.#cpusHandler(),
    '--homedir': () => this.#homeDirHandler(),
    '--username': () => this.#usernameHandler(),
    '--architecture': () => this.#architectureHandler(),
  };

  #eolHandler() {
    console.log('EOL:', EOL);
  }

  #cpusHandler() {
    const cpusCount = cpus().length;
    const cpusTable = this.#getCpusTable();
    console.log(`Overall amount of CPUs: ${cpusCount}`);
    console.table(cpusTable);
  }

  #getCpusTable() {
    /** @type {Record<number, { model: string, speed: string }>} */
    const table = {};
    const cpusInfo = cpus();
    const cpusCount = cpusInfo.length;

    for (let index = 0; index < cpusCount; index++) {
      const { model, speed } = cpusInfo[index];
      table[index + 1] = {
        model: model.split(' CPU')[0],
        speed: `${this.#getCpuSpeed(speed)} GHz`,
      };
    }

    return table;
  }

  /** @param {number} speed */
  #getCpuSpeed(speed) {
    const isSpeedInHz = speed >= 100;
    if (isSpeedInHz) return speed / 1000;
    return speed / 10;
  }

  #homeDirHandler() {
    console.log(`Home directory is ${homedir()}`);
  }

  #usernameHandler() {
    console.log(`Username: ${userInfo().username}`);
  }

  #architectureHandler() {
    console.log(`This processor architecture is ${arch()}`);
  }
}
