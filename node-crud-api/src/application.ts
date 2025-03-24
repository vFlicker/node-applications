import {
  BaseController,
  BaseServer,
  Server,
} from './shared/libs/rest/index.js';

interface AppConfig {
  host: string;
  port: number;
}

export class Application {
  private readonly server: Server = new BaseServer();
  private readonly config: AppConfig;
  private readonly controllers: BaseController[];

  constructor(config: AppConfig, controllers: BaseController[]) {
    this.config = config;
    this.controllers = controllers;
  }

  public init() {
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
