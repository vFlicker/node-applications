import { readdir } from 'node:fs/promises';
import { cwd } from 'node:process';

import { AbstractCommand } from '../AbstractCommand.js';

export class LsCommand extends AbstractCommand {
  getName() {
    return 'ls';
  }

  async execute() {
    const directoryPath = cwd();
    const directoryContents = await readdir(directoryPath);
    const list = directoryContents.join('\n');
    return list;
  }
}
