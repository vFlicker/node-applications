import { createReadStream, createWriteStream } from 'node:fs';
import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { pipeline } from 'node:stream/promises';

import { InvalidInputError } from '#src/shared/errors/index.js';

import { AbstractCommand } from '../AbstractCommand.js';

export class CpCommand extends AbstractCommand {
  getName() {
    return 'cp';
  }

  /**
   * @param {string} filePath
   * @param {string} directoryPath
   */
  async execute(filePath, directoryPath) {
    if (!filePath || !directoryPath) throw new InvalidInputError();
    const workingDirectory = cwd();
    const resolvedFilePath = resolve(workingDirectory, filePath);
    const resolvedDirectoryPath = resolve(workingDirectory, directoryPath);
    await this.#copyFile(resolvedFilePath, resolvedDirectoryPath);
  }

  /**
   * @param {string} sourcePath
   * @param {string} directoryPath
   */
  async #copyFile(sourcePath, directoryPath) {
    const readStream = createReadStream(sourcePath, {
      encoding: 'utf8',
    });
    const writeStream = createWriteStream(directoryPath, {
      encoding: 'utf8',
    });

    await pipeline(readStream, writeStream);
  }
}
