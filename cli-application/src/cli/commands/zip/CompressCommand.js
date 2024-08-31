import { createReadStream, createWriteStream } from 'node:fs';
import { basename, resolve } from 'node:path';
import { cwd } from 'node:process';
import { pipeline } from 'node:stream/promises';
import { createBrotliCompress } from 'node:zlib';

import { InvalidInputError } from '#src/shared/Errors/index.js';

import { AbstractCommand } from '../AbstractCommand.js';

export class CompressCommand extends AbstractCommand {
  getName() {
    return 'compress';
  }

  /**
   * @param {string} sourcePath
   * @param {string} destinationPath
   */
  async execute(sourcePath, destinationPath) {
    if (!sourcePath || !destinationPath) throw new InvalidInputError();
    const workingDirectory = cwd();
    const resolvedSourcePath = resolve(workingDirectory, sourcePath);
    const fileName = basename(resolvedSourcePath);
    const resolvedDestinationPath = resolve(
      workingDirectory,
      destinationPath,
      `${fileName}.gz`,
    );
    const readStream = createReadStream(resolvedSourcePath);
    const writeStream = createWriteStream(resolvedDestinationPath);
    const gzip = createBrotliCompress();
    await pipeline(readStream, gzip, writeStream);
  }
}
