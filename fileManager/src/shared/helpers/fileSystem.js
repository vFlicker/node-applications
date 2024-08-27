import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function getCurrentModuleDirectoryPath() {
  const __filename = fileURLToPath(import.meta.url);
  return dirname(__filename);
}
