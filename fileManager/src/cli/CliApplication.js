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
    this.#greetUser();
    this.#setupInputHandling();
    this.#setupExitHandling();
  }

  #greetUser() {
    this.#userInterface.displayMessage(
      `Welcome to the File Manager, ${this.#userName}!`,
    );
  }

  #setupInputHandling() {
    this.#userInterface.onInput((line) => {
      this.#commandRegistry.processCommand(line);
    });
  }

  #setupExitHandling() {
    process.on('exit', () => {
      this.#farewellUser();
      this.#userInterface.close();
    });
  }

  #farewellUser() {
    this.#userInterface.displayMessage(
      `Thank you for using File Manager, ${this.#userName}, goodbye!`,
    );
  }

  /** @param {AbstractCommand[]} commands */
  registerCommand(commands) {
    this.#commandRegistry.registerCommand(commands);
  }
}
