import { dirname, join, resolve } from 'node:path';

export const resolveFilePath = (filePath: string): string => {
  const __dirname = resolve(dirname(''));
  return join(__dirname, filePath);
};
