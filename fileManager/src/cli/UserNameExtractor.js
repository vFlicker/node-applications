export class UserNameExtractor {
  /** @param {string[]} argv */
  static extract(argv) {
    const USERNAME_PREFIX = '--username=';
    const DEFAULT_USERNAME = 'User';

    const userNameArg = argv.find((arg) => arg.startsWith(USERNAME_PREFIX));
    return userNameArg
      ? userNameArg.slice(USERNAME_PREFIX.length)
      : DEFAULT_USERNAME;
  }
}
