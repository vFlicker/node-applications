import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

import { InvalidInputError } from '#src/shared/errors/index.js';

import { AbstractCommand } from '../AbstractCommand.js';

export class AddCommand extends AbstractCommand {
  getName() {
    return 'add';
  }

  /** @param {string} newFileName */
  async execute(newFileName) {
    if (!newFileName) throw new InvalidInputError();
    const workingDirectory = cwd();
    const resolvedPath = resolve(workingDirectory, newFileName);
    await writeFile(resolvedPath, '', { encoding: 'utf8', flag: 'wx' });
  }
}
