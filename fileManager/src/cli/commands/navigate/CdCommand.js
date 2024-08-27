import { getCurrentModuleDirectoryPath } from '#src/shared/helpers/fileSystem.js';

import { AbstractCommand } from '../AbstractCommand.js';

export class CdCommand extends AbstractCommand {
  getName() {
    return 'cd';
  }

  /** @param {string} newPath */
  execute(newPath) {
    const modulePath = getCurrentModuleDirectoryPath();
    console.log(
      `TODO: implement cd command new path - ${newPath}, module path - ${modulePath}`,
    );
  }
}
