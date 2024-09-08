import { rename } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

import { InvalidInputError } from '#src/shared/errors/index.js';

import { AbstractCommand } from '../AbstractCommand.js';

export class RnCommand extends AbstractCommand {
  getName() {
    return 'rn';
  }

  /**
   * @param {string} filePath
   * @param {string} newFileName
   */
  async execute(filePath, newFileName) {
    if (!filePath || !newFileName) throw new InvalidInputError();
    const workingDirectory = cwd();
    const resolvedPath = resolve(workingDirectory, filePath);
    await rename(resolvedPath, newFileName);
  }
}
