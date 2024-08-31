import { homedir } from 'node:os';
import { chdir, cwd } from 'node:process';

import { InvalidInputError } from '#src/shared/Errors/index.js';
import { ColorPrinter } from '#src/shared/libs/ColorPrinter/index.js';
import { ConsoleIO } from '#src/shared/libs/io/index.js';

import { CommandManager } from './CommandManager.js';
import { AbstractCommand } from './commands/AbstractCommand.js';

export class CliApplication {
  #userName = '';
  #userInterface = new ConsoleIO();
  #commandRegistry = new CommandManager();

  /** @param {string[]} argv */
  init(argv) {
    this.#setInitialDirectory();
    this.#setupExitHandling();
    this.#setupInputHandling();
    this.#extractUserName(argv);
    this.#showHelloMessage();
    this.#showCurrentDirectory();
    this.#userInterface.startPrompting();
  }

  #showHelloMessage() {
    ColorPrinter.blue(`Welcome to the File Manager, ${this.#userName}!`);
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
        this.#handleErrors(error);
      }

      this.#showCurrentDirectory();
      this.#userInterface.startPrompting();
    });
  }

  /** @param {string[]} argv */
  #extractUserName(argv) {
    const USERNAME_PREFIX = '--username=';
    const DEFAULT_USERNAME = 'User';

    const userNameArg = argv.find((arg) => arg.startsWith(USERNAME_PREFIX));
    this.#userName = userNameArg
      ? userNameArg.slice(USERNAME_PREFIX.length)
      : DEFAULT_USERNAME;
  }

  /** @param {unknown} error */
  #handleErrors(error) {
    if (error instanceof InvalidInputError) {
      ColorPrinter.red(error.message);
    } else {
      ColorPrinter.red('Operation failed');
    }
  }

  #showCurrentDirectory() {
    ColorPrinter.log(`You are currently in ${cwd()}`);
  }

  #setupExitHandling() {
    process.on('exit', () => {
      this.#showGoodbyeMessage();
      this.#userInterface.close();
    });
  }

  #showGoodbyeMessage() {
    ColorPrinter.blue(
      `Thank you for using File Manager, ${this.#userName}, goodbye!`,
    );
  }

  /** @param {AbstractCommand[]} commands */
  registerCommand(commands) {
    this.#commandRegistry.registerCommand(commands);
  }
}
