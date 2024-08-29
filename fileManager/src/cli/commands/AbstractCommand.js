export class AbstractCommand {
  constructor() {
    if (new.target === AbstractCommand) {
      throw new Error('Cannot construct AbstractCommand instances directly');
    }
  }

  /** @returns {string} */
  getName() {
    throw new Error('You have to implement: getName');
  }

  /**
   * @param {...string} params
   * @returns {Promise<string | void>}
   */
  execute(...params) {
    throw new Error('You have to implement: execute');
  }
}
