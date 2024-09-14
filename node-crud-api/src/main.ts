import { Application } from './application.js';
import { InMemoryDatabase } from './shared/libs/database/index.js';
import { UserController } from './shared/modules/user/index.js';

const PORT = 8000;

const bootstrap = () => {
  const database = new InMemoryDatabase();
  const userController = new UserController(database);
  const application = new Application(PORT, userController);
  application.init();
};

bootstrap();
