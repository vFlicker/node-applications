import { createReadStream, createWriteStream } from 'node:fs';
import { rm, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { pipeline } from 'node:stream/promises';

import { InvalidInputError } from '#src/shared/errors/index.js';

import { AbstractCommand } from '../AbstractCommand.js';

export class MvCommand extends AbstractCommand {
  getName() {
    return 'mv';
  }

  /**
   * @param {string} filePath
   * @param {string} directoryPath
   */
  async execute(filePath, directoryPath) {
    if (!filePath || !directoryPath) throw new InvalidInputError();
    const workingDirectory = cwd();
    const resolvedSourcePath = resolve(workingDirectory, filePath);
    const resolvedDestinationPath = resolve(workingDirectory, directoryPath);
    await this.#moveFile(resolvedSourcePath, resolvedDestinationPath);
  }

  /**
   * @param {string} sourcePath
   * @param {string} directoryPath
   */
  async #moveFile(sourcePath, directoryPath) {
    const readStream = createReadStream(sourcePath, { encoding: 'utf8' });
    const writeStream = createWriteStream(directoryPath, { encoding: 'utf8' });
    await pipeline(readStream, writeStream);
    await rm(sourcePath);
  }
}
