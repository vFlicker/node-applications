import { AbstractCommand } from './AbstractCommand.js';

export class HelpCommand extends AbstractCommand {
  getName() {
    return 'help';
  }

  execute() {
    console.log('TODO: implement help command');
  }
}
