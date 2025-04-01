import cluster from 'node:cluster';
import os from 'node:os';
import { resolve } from 'node:path';

import express from 'express';

import { ExitCode, PORT } from './constants.js';
import { DatabaseClient, IPCManager } from './database/index.js';
import {
  createEventController,
  createEventRepository,
  createEventRouter,
} from './event/index.js';
import { getCurrentModuleDirectoryPath } from './helpers/index.js';
import { corsMiddleware, errorMiddleware } from './middlewares/index.js';

if (cluster.isPrimary) {
  const modulePath = getCurrentModuleDirectoryPath(import.meta.url);
  const databasePath = resolve(modulePath, './database/databaseProcess.js');
  const ipcManager = new IPCManager(databasePath);

  const serverWorkersCount = os.cpus().length - 1;
  for (let i = 0; i < serverWorkersCount; i++) {
    const serverWorker = cluster.fork({ WORKER_PORT: PORT + i });
    ipcManager.registerWorker(serverWorker);
  }
}

if (!cluster.isPrimary) {
  const WORKER_PORT = process.env.WORKER_PORT;

  const app = express();

  app.use(express.json());
  app.use(corsMiddleware);

  const databaseClient = new DatabaseClient();
  const eventRepository = createEventRepository(databaseClient);
  const eventController = createEventController(eventRepository);
  const eventRouter = createEventRouter(eventController);

  app.use('/events', eventRouter);
  app.use(errorMiddleware);

  const onListeningHandler = () => {
    const url = `http://localhost:${WORKER_PORT}`;
    const serverStatusMessage = `Server is running on ${url}`;
    console.log(serverStatusMessage);
  };

  const onErrorHandler = (err) => {
    console.error(`An error occurred: ${err.message}`);
    process.exit(ExitCode.ERROR);
  };

  app
    .listen(WORKER_PORT)
    .on('listening', onListeningHandler)
    .on('error', onErrorHandler);
}
