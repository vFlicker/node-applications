import { ChildProcess, fork } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE_PATH = './databaseProcess.js';

const getDatabasePath = (): string => {
  const __filename = fileURLToPath(import.meta.url);
  const modulePath = dirname(__filename);
  return resolve(modulePath, FILE_PATH);
};

export const createDatabaseProcess = (): ChildProcess => {
  const databasePath = getDatabasePath();
  return fork(databasePath);
};
