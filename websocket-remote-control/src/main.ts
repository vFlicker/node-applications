import { createHttpServer } from './http-server.js';
import { createWsServer } from './ws-server.js';

const HOSTNAME = '127.0.0.1';
const HTTP_SERVER_PORT = 3000;
const WS_SERVER_PORT = 8080;

const frontendServer = createHttpServer({
  hostname: HOSTNAME,
  port: HTTP_SERVER_PORT,
});

const backendServer = createWsServer({
  hostname: HOSTNAME,
  port: WS_SERVER_PORT,
});

process.on('SIGINT', () => {
  frontendServer.close();
  backendServer.close();
  process.exit();
});
