import { Application } from './application.js';
import { Config } from './shared/config/index.js';
import { InMemoryDatabase } from './shared/libs/database/index.js';
import {
  DefaultUserService,
  UserController,
} from './user/index.js';

const bootstrap = () => {
  const config = new Config();
  const database = new InMemoryDatabase();
  const userService = new DefaultUserService(database);
  const userController = new UserController(userService);
  const application = new Application(config.port, userController);
  application.init();
};

bootstrap();
