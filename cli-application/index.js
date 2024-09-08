const ConsoleColor = {
  DEFAULT: `\x1b[0m`,
  BLUE: `\x1b[0;34m`,
  YELLOW: `\x1b[0;33m`,
  RED: `\x1b[0;31m`,
  RESET: '\x1b[0m',
};

class ConsoleColorPrinter {
  /** @param {string} message */
  static success(message) {
    ConsoleColorPrinter.#printWithColor(message, ConsoleColor.BLUE);
  }

  /** @param {string} message */
  static warning(message) {
    ConsoleColorPrinter.#printWithColor(message, ConsoleColor.YELLOW);
  }

  /** @param {string} message */
  static error(message) {
    ConsoleColorPrinter.#printWithColor(message, ConsoleColor.RED);
  }

  /** @param {string} message */
  static log(message) {
    ConsoleColorPrinter.#printWithColor(message);
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
