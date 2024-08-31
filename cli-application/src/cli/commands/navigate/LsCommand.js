import { Dirent } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { cwd } from 'node:process';

import { ColorPrinter } from '#src/shared/libs/ColorPrinter/index.js';

import { AbstractCommand } from '../AbstractCommand.js';

export class LsCommand extends AbstractCommand {
  getName() {
    return 'ls';
  }

  async execute() {
    const workingDirectory = cwd();
    const directoryContents =
      await this.#getDirectoryContents(workingDirectory);
    const table = this.#createSortedTable(directoryContents);
    ColorPrinter.table(table);
  }

  /** @param {string} directoryPath */
  async #getDirectoryContents(directoryPath) {
    return readdir(directoryPath, { withFileTypes: true });
  }

  /** @param {Dirent[]} directoryContents */
  #createSortedTable(directoryContents) {
    return directoryContents
      .map(this.#mapDirectoryEntryToTableRow)
      .sort(this.#sortTableRows);
  }

  /**
   * @param {Dirent} entry
   * @returns {{ Name: string, Type: string }}
   */
  #mapDirectoryEntryToTableRow(entry) {
    return {
      Name: entry.name,
      Type: entry.isDirectory() ? 'directory' : 'file',
    };
  }

  /**
   * @param {{ Name: string, Type: string }} a
   * @param {{ Name: string, Type: string }} b
   */
  #sortTableRows(a, b) {
    if (a.Type === b.Type) return a.Name.localeCompare(b.Name);
    return a.Type === 'directory' ? -1 : 1;
  }
}
