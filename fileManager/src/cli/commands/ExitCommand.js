import { AbstractCommand } from './AbstractCommand.js';

export class ExitCommand extends AbstractCommand {
  getName() {
    return '.exit';
  }

  execute() {
    process.exit(0);
  }
}
