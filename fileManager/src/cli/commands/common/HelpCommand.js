import { AbstractCommand } from '../AbstractCommand.js';

export class HelpCommand extends AbstractCommand {
  getName() {
    return 'help';
  }

  async execute() {
    return `
      This is file manager CLI.

      Available commands:
        - help        print this text
        - .exit       exit the CLI
        - ls          list files in current directory
        - cd          change directory
    `;
  }
}
