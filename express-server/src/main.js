import cluster from 'node:cluster';
import os from 'node:os';

import express from 'express';

import { ExitCode, PORT } from './constants.js';
import { database } from './database.js';
import { createEventController } from './event/createEventController.js';
import { createEventRepository } from './event/createEventRepository.js';
import { createEventRouter } from './event/index.js';
import { corsMiddleware, errorMiddleware } from './middlewares/index.js';

if (cluster.isPrimary) {
  const serverInstantsCount = os.cpus().length - 1;
  for (let i = 0; i < serverInstantsCount; i++) {
    cluster.fork({ WORKER_PORT: PORT + i });
  }
}

if (!cluster.isPrimary) {
  const WORKER_PORT = process.env.WORKER_PORT;

  const app = express();

  app.use(express.json());
  app.use(corsMiddleware);

  const eventRepository = createEventRepository(database);
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
