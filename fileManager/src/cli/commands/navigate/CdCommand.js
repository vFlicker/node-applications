import { chdir } from 'node:process';

import { AbstractCommand } from '../AbstractCommand.js';

export class CdCommand extends AbstractCommand {
  getName() {
    return 'cd';
  }

  async execute(directoryPath = './') {
    chdir(directoryPath);
  }
}
