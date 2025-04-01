import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCurrentModuleDirectoryPath = (url) => {
  const __filename = fileURLToPath(url);
  return dirname(__filename);
};
