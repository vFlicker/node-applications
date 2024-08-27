export class CommandParser {
  /**
   * @param {string} line
   * @returns {{ commandName: string, commandArguments: string[] }}
   */
  static parse(line) {
    const cliArguments = line.trim().split(' ');
    const commandName = cliArguments.shift() || '';
    return { commandName, commandArguments: cliArguments };
  }
}
