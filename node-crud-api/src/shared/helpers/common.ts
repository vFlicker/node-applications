import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getCurrentModuleDirectoryPath = (url: string): string => {
  const __filename = fileURLToPath(url);
  return dirname(__filename);
};
