import { Controller, RestServer } from './shared/libs/rest/index.js';

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
      this.server.registerControllers(this.controllers);
      this.server.listen(port);
    } catch (err) {
      console.error('Error starting server:', err);
      return;
    }

    console.log(`Server running at http://${host}:${port}/`);
  }
}
