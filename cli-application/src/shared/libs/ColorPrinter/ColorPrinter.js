const ConsoleColor = {
  DEFAULT: `\x1b[0m`,
  GREEN: `\x1b[0;32m`,
  YELLOW: `\x1b[0;33m`,
  BLUE: `\x1b[0;34m`,
  RED: `\x1b[0;31m`,
  RESET: '\x1b[0m',
};

export class ColorPrinter {
  /** @param {string} message */
  static green(message) {
    this.#printWithColor(message, ConsoleColor.GREEN);
  }

  /** @param {string} message */
  static blue(message) {
    this.#printWithColor(message, ConsoleColor.BLUE);
  }

  /** @param {string} message */
  static yellow(message) {
    this.#printWithColor(message, ConsoleColor.YELLOW);
  }

  /** @param {string} message */
  static red(message) {
    this.#printWithColor(message, ConsoleColor.RED);
  }

  /** @param {string} message */
  static log(message) {
    this.#printWithColor(message);
  }

  /** @param {Object} data */
  static table(data) {
    console.table(data);
  }

  /**
   * @param {string} message
   * @param {string} color
   */
  static #printWithColor(message, color = ConsoleColor.DEFAULT) {
    console.log(`${color}${message}${ConsoleColor.RESET}`);
  }
}
