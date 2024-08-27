import { AbstractCommand } from './AbstractCommand.js';

export class LsCommand extends AbstractCommand {
  getName() {
    return 'ls';
  }

  execute() {
    console.log('TODO: implement ls command');
  }
}
