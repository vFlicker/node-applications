import { Application } from './application.js';
import { Config } from './shared/config/index.js';
import { InMemoryDatabase } from './shared/libs/database/index.js';
import { DefaultUserService, UserController } from './user/index.js';

const config = new Config();

if (!config.hasHorizontalScaling) {
  const inMemoryDatabase = new InMemoryDatabase();
  const userService = new DefaultUserService(inMemoryDatabase);
  const userController = new UserController(userService);
  const application = new Application(config.port, userController);
  application.init();
} else {
  console.log('Horizontal scaling is not supported');
}
