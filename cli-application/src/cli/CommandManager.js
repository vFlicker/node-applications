import { InvalidInputError } from '#src/shared/Errors/index.js';

import { CommandParser } from './CommandParser.js';
import { AbstractCommand } from './commands/AbstractCommand.js';

export class CommandManager {
  /** @type {Map<string, AbstractCommand>} */
  #commands = new Map();

  /** @param {AbstractCommand[]} commands */
  registerCommand(commands) {
    for (const command of commands) {
      this.#registerSingleCommand(command);
    }
  }

  /** @param {AbstractCommand} command */
  #registerSingleCommand(command) {
    const commandName = command.getName();

    if (this.#commands.has(commandName)) {
      throw new Error(`Command with name ${commandName} already exists.`);
    }

    this.#commands.set(commandName, command);
  }

  /** @param {string} line */
  async processCommand(line) {
    const { commandName, commandArguments } = CommandParser.parse(line);
    const command = this.#getCommand(commandName);
    if (!command) throw new InvalidInputError();
    await command.execute(...commandArguments);
  }

  /** @param {string} commandName */
  #getCommand(commandName) {
    return this.#commands.get(commandName);
  }
}
