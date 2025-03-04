// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import childProcess from 'child_process';
import cluster from 'cluster';
import os from 'os';

import { Application } from './application.js';
import { Config } from './shared/config/index.js';
import { InMemoryDatabase } from './shared/libs/database/index.js';
import { IPCDatabase } from './shared/libs/database/ipc-database/ipc-database.js';
import { DefaultUserService, UserController } from './user/index.js';

const config = new Config();

if (!config.hasHorizontalScaling) {
  const inMemoryDatabase = new InMemoryDatabase();
  const userService = new DefaultUserService(inMemoryDatabase);
  const userController = new UserController(userService);
  const application = new Application(config.port, userController);
  application.init();
} else {
  if (cluster.isPrimary) {
    const cpuCounts = os.cpus().length;

    // Start the database process
    const databaseWorker = cluster.fork({ ROLE: 'database' });
    const databaseWorkerId = databaseWorker.id;

    const workers: { [id: string]: cluster.Worker } = {};

    // Fork worker processes
    for (let index = 0; index < cpuCounts; index++) {
      const WORKER_PORT = config.port + index;
      const worker = cluster.fork({
        ROLE: 'worker',
        WORKER_PORT,
      });
      workers[worker.id] = worker;

      worker.on('exit', () => {
        console.log(`Worker is dead: ${worker.process.pid}`);
      });

      // Handle messages from workers
      worker.on('message', (message) => {
        if (message.to === 'database') {
          databaseWorker.send({ ...message, from: worker.id });
        }
      });
    }

    // Handle messages from the database process
    databaseWorker.on('message', (message) => {
      const toWorkerId = message.to;
      const toWorker = workers[toWorkerId];
      if (toWorker) {
        toWorker.send(message);
      }
    });
  } else {
    const ROLE = process.env.ROLE;

    if (ROLE === 'database') {
      // Database process code
      const { startDatabaseProcess } = await import(
        './shared/libs/database/ipc-database/database-process.js'
      );
      startDatabaseProcess();
    } else if (ROLE === 'worker') {
      // Worker process code
      const PORT = parseInt(process.env.WORKER_PORT!, 10);
      const database = new IPCDatabase();
      const userService = new DefaultUserService(database);
      const userController = new UserController(userService);
      const application = new Application(PORT, userController);
      application.init();
    }
  }
}
