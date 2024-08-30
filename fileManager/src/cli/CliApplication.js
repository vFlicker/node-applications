import { homedir } from 'node:os';
import { chdir, cwd } from 'node:process';

import { CommandRegistry } from './CommandRegistry.js';
import { AbstractCommand } from './commands/AbstractCommand.js';
import { ConsoleIO } from './io/ConsoleInterface.js';
import { UserNameExtractor } from './parsers/UserNameExtractor.js';

export class CliApplication {
  #userName = '';
  #userInterface = new ConsoleIO();
  #commandRegistry = new CommandRegistry();

  /** @param {string[]} argv */
  init(argv) {
    this.#userName = UserNameExtractor.extract(argv);
    this.#showHelloMessage();
    this.#setInitialDirectory();
    this.#showCurrentDirectory();
    this.#setupInputHandling();
    this.#userInterface.startPrompting();
    this.#setupExitHandling();
  }

  #showHelloMessage() {
    this.#userInterface.displayMessage(
      `Welcome to the File Manager, ${this.#userName}!`,
    );
  }

  #setInitialDirectory() {
    const homedirDirectory = homedir();
    chdir(homedirDirectory);
  }

  #setupInputHandling() {
    this.#userInterface.onInput(async (line) => {
      try {
        await this.#commandRegistry.processCommand(line);
      } catch (error) {
        this.#userInterface.displayMessage('Operation failed');
      }

      this.#showCurrentDirectory();
      this.#userInterface.startPrompting();
    });
  }

  #showCurrentDirectory() {
    this.#userInterface.displayMessage(`You are currently in ${cwd()}`);
  }

  #setupExitHandling() {
    process.on('exit', () => {
      this.#showGoodbyeMessage();
      this.#userInterface.close();
    });
  }

  #showGoodbyeMessage() {
    this.#userInterface.displayMessage(
      `Thank you for using File Manager, ${this.#userName}, goodbye!`,
    );
  }

  /** @param {AbstractCommand[]} commands */
  registerCommand(commands) {
    this.#commandRegistry.registerCommand(commands);
  }
}
