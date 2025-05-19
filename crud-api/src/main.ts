import cluster from 'node:cluster';
import os from 'node:os';

import { Application } from './application.js';
import { DefaultUserService, UserController } from './modules/user/index.js';
import { RestConfig } from './shared/config/index.js';
import { createDatabaseProcess } from './shared/libs/database/createDatabaseProcess.js';
import { DatabaseClient, IPCManager } from './shared/libs/database/index.js';

const config = new RestConfig();

const hasHorizontalScaling = config.get('HAS_HORIZONTAL_SCALING');
const appConfig = {
  host: config.get('HOST_NAME'),
  port: config.get('PORT'),
};

if (!hasHorizontalScaling) {
  const databaseProcess = createDatabaseProcess();
  const inMemoryDatabase = new DatabaseClient(databaseProcess);
  const userService = new DefaultUserService(inMemoryDatabase);
  const userController = new UserController(userService);

  const application = new Application(appConfig, [userController]);

  application.init();
}

if (hasHorizontalScaling) {
  if (cluster.isPrimary) {
    const databaseProcess = createDatabaseProcess();
    const ipcManager = new IPCManager(databaseProcess);

    const serverWorkersCount = os.cpus().length - 1;
    for (let i = 0; i < serverWorkersCount; i++) {
      const serverWorker = cluster.fork({ WORKER_PORT: appConfig.port + i });
      ipcManager.registerWorker(serverWorker);
    }
  }

  if (cluster.isWorker) {
    const WORKER_PORT = process.env.WORKER_PORT || 3000;

    const databaseClient = new DatabaseClient();
    const userService = new DefaultUserService(databaseClient);
    const userController = new UserController(userService);

    const application = new Application({ ...appConfig, port: +WORKER_PORT }, [
      userController,
    ]);

    application.init();
  }
}
