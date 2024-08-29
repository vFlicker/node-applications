import { AbstractCommand } from './commands/AbstractCommand.js';
import { CommandParser } from './parsers/CommandParser.js';

export class CommandRegistry {
  /** @type {Map<string, AbstractCommand>} */
  #commands = new Map();
  #defaultCommandName;

  constructor(defaultCommandName = 'help') {
    this.#defaultCommandName = defaultCommandName;
  }

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
    return command.execute(...commandArguments);
  }

  /** @param {string} commandName */
  #getCommand(commandName) {
    return this.#commands.get(commandName) ?? this.#getDefaultCommand();
  }

  #getDefaultCommand() {
    const defaultCommand = this.#commands.get(this.#defaultCommandName);

    if (!defaultCommand) {
      throw new Error(
        `The default command (${this.#defaultCommandName}) is not registered.`,
      );
    }

    return defaultCommand;
  }
}
