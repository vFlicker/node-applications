import { WebSocketServer } from 'ws';

import { handleMessage } from './app/handleMessage.js';
import { parseMessage } from './app/parseMessage.js';
import { log } from './helpers/logger.js';

type WsServerConfig = {
  hostname: string;
  port: number;
};

export const createWsServer = ({
  hostname,
  port,
}: WsServerConfig): WebSocketServer => {
  const ws = new WebSocketServer({ host: hostname, port });

  ws.on('connection', (socket) => {
    socket.on('message', async (rawData) => {
      const message = rawData.toString();
      log(`Request: ${message}`, 'info');

      try {
        const action = parseMessage(message);
        const response = await handleMessage(action);
        socket.send(response);
        log(`Response: ${response}`, 'success');
      } catch (err: unknown) {
        if (!(err instanceof Error)) {
          console.error('Unexpected error:', err);
          socket.send('Internal server error');
          return;
        }

        socket.send(err.message);
        log(`Response: ${err.message}`, 'error');
      }
    });

    socket.on('error', (err) => log(`WebSocket error: ${err}`, 'error'));
    socket.on('close', () => log('Client disconnected', 'info'));
  });

  log(`WebSocket server listening on ws://${hostname}:${port}/`, 'success');

  return ws;
};
