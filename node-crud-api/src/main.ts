import { Application } from './application.js';
import { UserController } from './user/UserController.js';

const PORT = 8000;

const bootstrap = () => {
  const userController = new UserController();
  const application = new Application(PORT, userController);
  application.init();
};

bootstrap();
