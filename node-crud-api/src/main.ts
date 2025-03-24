import { Application } from './application.js';
import { DefaultUserService, UserController } from './modules/user/index.js';
import { RestConfig } from './shared/config/index.js';
import { InMemoryDatabase } from './shared/libs/database/index.js';

const config = new RestConfig();

const hasHorizontalScaling = config.get('HAS_HORIZONTAL_SCALING');
const appConfig = {
  host: config.get('HOST_NAME'),
  port: config.get('PORT'),
};

if (!hasHorizontalScaling) {
  const inMemoryDatabase = new InMemoryDatabase();
  const userService = new DefaultUserService(inMemoryDatabase);
  const userController = new UserController(userService);

  const application = new Application(appConfig, [userController]);

  application.init();
}

if (hasHorizontalScaling) {
  console.log('Horizontal scaling is not supported');
}
