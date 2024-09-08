import { createReadStream, createWriteStream } from 'node:fs';
import { basename, resolve } from 'node:path';
import { cwd } from 'node:process';
import { pipeline } from 'node:stream/promises';
import { createBrotliDecompress } from 'node:zlib';

import { InvalidInputError } from '#src/shared/errors/index.js';

import { AbstractCommand } from '../AbstractCommand.js';

export class DecompressCommand extends AbstractCommand {
  getName() {
    return 'decompress';
  }

  /**
   * @param {string} sourcePath
   * @param {string} destinationPath
   */
  async execute(sourcePath, destinationPath) {
    if (!sourcePath || !destinationPath) throw new InvalidInputError();
    const workingDirectory = cwd();
    const resolvedSourcePath = resolve(workingDirectory, sourcePath);
    const [fileName] = basename(resolvedSourcePath).split('.gz');
    const resolvedDestinationPath = resolve(
      workingDirectory,
      destinationPath,
      fileName,
    );
    const readStream = createReadStream(resolvedSourcePath);
    const writeStream = createWriteStream(resolvedDestinationPath);
    const gzip = createBrotliDecompress();
    await pipeline(readStream, gzip, writeStream);
  }
}
