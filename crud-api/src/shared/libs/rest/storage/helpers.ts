import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const resolveDirPath = (dirName: string): string => {
  const __filename = fileURLToPath(import.meta.url);
  const modulePath = dirname(__filename);
  return resolve(modulePath, dirName);
};

export const createDirectoryIfNotExists = (dirName: string): void => {
  const dirPath = resolveDirPath(dirName);

  if (!existsSync(dirPath)) {
    try {
      mkdirSync(dirPath, { recursive: true });
      console.log(`Created ${dirName} directory at: ${dirPath}`);
    } catch (err) {
      console.error(`Failed to create ${dirName} directory: ${err}`);
    }
  }
};
