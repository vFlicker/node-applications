import express from 'express';

import { ExitCode, PORT } from './constants.js';
import { database } from './database.js';
import { createEventController } from './event/createEventController.js';
import { createEventRepository } from './event/createEventRepository.js';
import { createEventRouter } from './event/index.js';
import { corsMiddleware, errorMiddleware } from './middlewares/index.js';

const app = express();

app.use(express.json());
app.use(corsMiddleware);

const eventRepository = createEventRepository(database);
const eventController = createEventController(eventRepository);
const eventRouter = createEventRouter(eventController);

app.use('/events', eventRouter);
app.use(errorMiddleware);

const onListeningHandler = () => {
  const url = `http://localhost:${PORT}`;
  const serverStatusMessage = `Server is running on ${url}`;
  console.log(serverStatusMessage);
};

const onErrorHandler = (err) => {
  console.error(`An error occurred: ${err.message}`);
  process.exit(ExitCode.ERROR);
};

app
  .listen(PORT)
  .on('listening', onListeningHandler)
  .on('error', onErrorHandler);
