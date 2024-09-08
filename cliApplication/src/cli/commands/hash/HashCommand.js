import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { pipeline } from 'node:stream/promises';

import { InvalidInputError } from '#src/shared/errors/index.js';
import { ColorPrinter } from '#src/shared/libs/printer/index.js';

import { AbstractCommand } from '../AbstractCommand.js';

export class HashCommand extends AbstractCommand {
  getName() {
    return 'hash';
  }

  /** @param {string} filePath */
  async execute(filePath) {
    if (!filePath) throw new InvalidInputError();
    const workingDirectory = cwd();
    const resolvedPath = resolve(workingDirectory, filePath);
    const readStream = createReadStream(resolvedPath, { encoding: 'utf8' });
    const hashStream = createHash('sha256');
    await pipeline(readStream, hashStream);
    ColorPrinter.green(hashStream.digest('hex'));
  }
}
