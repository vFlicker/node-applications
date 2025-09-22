import {
  DefaultExceptionFilter,
  HttpErrorFilter,
  ValidationExceptionFilter,
} from './shared/filters/index.js';
import { Controller, RestServer } from './shared/libs/rest/index.js';
import { CorsMiddleware } from './shared/middlewares/cors.middleware.js';

interface AppConfig {
  host: string;
  port: number;
}

export class Application {
  private readonly server = new RestServer();
  private readonly config: AppConfig;
  private readonly controllers: Controller[];

  constructor(config: AppConfig, controllers: Controller[]) {
    this.config = config;
    this.controllers = controllers;
  }

  public init(): void {
    const { host, port } = this.config;

    try {
      this.server.registerMiddlewares([
        new CorsMiddleware(['http://127.0.0.1:5500']),
      ]);

      this.server.registerExceptionFilters([
        new ValidationExceptionFilter(),
        new HttpErrorFilter(),
        new DefaultExceptionFilter(),
      ]);

      this.server.registerControllers(this.controllers);
      this.server.listen(port);
    } catch (err) {
      console.error('Error starting server:', err);
      return;
    }

    console.log(`Server running at http://${host}:${port}/`);
  }
}
