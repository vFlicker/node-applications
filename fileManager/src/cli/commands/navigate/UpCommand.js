import { chdir } from 'node:process';

import { AbstractCommand } from '../AbstractCommand.js';

export class UpCommand extends AbstractCommand {
  getName() {
    return 'up';
  }

  async execute() {
    chdir('../');
  }
}
