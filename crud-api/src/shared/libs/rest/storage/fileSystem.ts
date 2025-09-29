import { readFile, unlink, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { InvalidStoreFileError } from './invalid-store-file.errors.js';

const validateAndResolvePath = (fileName: string, dirPath: string): string => {
  if (typeof fileName !== 'string') {
    throw new InvalidStoreFileError();
  }

  const resolvedFileName = resolve(dirPath, fileName);
  if (!resolvedFileName.startsWith(dirPath)) {
    throw new InvalidStoreFileError();
  }

  return resolvedFileName;
};

export const safeReadFile = (
  fileName: string,
  dirPath: string,
): Promise<Buffer> => {
  const resolvedPath = validateAndResolvePath(fileName, dirPath);
  return readFile(resolvedPath);
};

export const safeWriteFile = (
  fileName: string,
  dirPath: string,
  data: string | NodeJS.ArrayBufferView,
): Promise<void> => {
  const resolvedPath = validateAndResolvePath(fileName, dirPath);
  return writeFile(resolvedPath, data);
};

export const safeUnlink = (
  fileName: string,
  dirPath: string,
): Promise<void> => {
  const resolvedPath = validateAndResolvePath(fileName, dirPath);
  return unlink(resolvedPath);
};
