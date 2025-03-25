import {
  Controller,
  Middleware,
  RestServer,
} from './shared/libs/rest/index.js';

interface AppConfig {
  host: string;
  port: number;
}

export class Application {
  private readonly server = new RestServer();
  private readonly config: AppConfig;
  private readonly controllers: Controller[];
  private readonly middlewares: Middleware[] = [];

  constructor(config: AppConfig, controllers: Controller[]) {
    this.config = config;
    this.controllers = controllers;
  }

  public use(middleware: Middleware): Application {
    this.middlewares.push(middleware);
    return this;
  }

  public init(): void {
    const { host, port } = this.config;

    try {
      // Register global middlewares
      for (const middleware of this.middlewares) {
        this.server.use(middleware);
      }

      this.server.registerControllers(this.controllers);
      this.server.listen(port, () => {
        console.log(`Server running at http://${host}:${port}/`);
      });
    } catch (err) {
      console.error('Error starting server:', err);
    }
  }

  public close(callback?: () => void): void {
    this.server.close((err) => {
      if (err) {
        console.error('Error closing server:', err);
      }
      if (callback) callback();
    });
  }
}
