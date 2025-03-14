import { Application } from './application.js';
import { DefaultUserService, UserController } from './modules/user/index.js';
import { RestConfig } from './shared/config/index.js';
import { InMemoryDatabase } from './shared/libs/database/index.js';

const config = new RestConfig();

if (!config.get('HAS_HORIZONTAL_SCALING')) {
  const inMemoryDatabase = new InMemoryDatabase();
  const userService = new DefaultUserService(inMemoryDatabase);
  const userController = new UserController(userService);
  const application = new Application(
    config.get('HOST_NAME'),
    config.get('PORT'),
    userController,
  );
  application.init();
} else {
  console.log('Horizontal scaling is not supported');
}
