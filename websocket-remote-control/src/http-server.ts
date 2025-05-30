import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { join } from 'node:path';

import { resolveFilePath } from './helpers/file-system.js';
import { log } from './helpers/logger.js';

const ROOT_DIRECTORY = '/';
const DEFAULT_FILE = '/index.html';
const STATIC_DIRECTORY = '/frontend';

type HttpServerConfig = {
  hostname: string;
  port: number;
};

export const createHttpServer = ({ hostname, port }: HttpServerConfig) => {
  const server = createServer(async ({ url }, res) => {
    const currentFile = url === ROOT_DIRECTORY ? DEFAULT_FILE : url;
    const currentFilePath = join(STATIC_DIRECTORY, currentFile || DEFAULT_FILE);
    const filePath = resolveFilePath(currentFilePath);

    try {
      const data = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'File not found' }));
    }
  });

  server.listen(port, hostname, () => {
    const message = `Http server listening on http://${hostname}:${port}/`;
    log(message, 'success');
  });

  return server;
};
