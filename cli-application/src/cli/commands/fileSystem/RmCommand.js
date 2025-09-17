import { rm } from 'node:fs/promises';

import { InvalidInputError } from '#src/shared/errors/index.js';

import { AbstractCommand } from '../AbstractCommand.js';

export class RmCommand extends AbstractCommand {
  getName() {
    return 'rm';
  }

  /** @param {string} filePath */
  async execute(filePath) {
    if (!filePath) throw new InvalidInputError();
    await rm(filePath);
  }
}
