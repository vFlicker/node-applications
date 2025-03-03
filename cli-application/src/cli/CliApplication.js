import { homedir } from 'node:os';
import { chdir, cwd } from 'node:process';

import { InvalidInputError } from '#src/shared/errors/index.js';
import { ConsoleIO } from '#src/shared/libs/io/index.js';
import { ColorPrinter } from '#src/shared/libs/printer/index.js';

import { CommandManager } from './CommandManager.js';
import { AbstractCommand } from './commands/AbstractCommand.js';

export class CliApplication {
  #userName = '';
  #userInterface = new ConsoleIO();
  #commandManager = new CommandManager();

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

  #setInitialDirectory() {
    const homedirDirectory = homedir();
    chdir(homedirDirectory);
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

  #setupInputHandling() {
    this.#userInterface.onInput(async (line) => {
      try {
        await this.#commandManager.processCommand(line);
      } catch (error) {
        this.#handleErrors(error);
      } finally {
        this.#showCurrentDirectory();
        this.#userInterface.startPrompting();
      }
    });
  }

  /** @param {unknown} error */
  #handleErrors(error) {
    if (error instanceof InvalidInputError) {
      ColorPrinter.red(error.message);
    } else {
      ColorPrinter.red('Operation failed');
    }
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

  #showHelloMessage() {
    ColorPrinter.blue(`Welcome to the File Manager, ${this.#userName}!`);
  }

  #showCurrentDirectory() {
    ColorPrinter.log(`You are currently in ${cwd()}`);
  }

  /** @param {AbstractCommand[]} commands */
  registerCommand(commands) {
    this.#commandManager.registerCommand(commands);
  }
}
