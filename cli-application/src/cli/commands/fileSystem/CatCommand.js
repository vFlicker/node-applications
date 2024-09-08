import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

import { InvalidInputError } from '#src/shared/errors/index.js';

import { AbstractCommand } from '../AbstractCommand.js';

export class CatCommand extends AbstractCommand {
  getName() {
    return 'cat';
  }

  /** @param {string} filePath */
  async execute(filePath) {
    if (!filePath) throw new InvalidInputError();
    const workingDirectory = cwd();
    const resolvedPath = resolve(workingDirectory, filePath);
    const readStream = createReadStream(resolvedPath, { encoding: 'utf8' });
    for await (const chunk of readStream) console.log(chunk);
  }
}
