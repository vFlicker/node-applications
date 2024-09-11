import {
  BaseController,
  BaseServer,
  Server,
} from './shared/libs/rest/index.js';

export class Application {
  private readonly server: Server;

  constructor(
    private readonly port: number,
    private readonly userController: BaseController,
  ) {
    this.server = new BaseServer();
  }

  public init() {
    this.initControllers();
    this.initServer();
    console.log(`Server running at http://localhost:${this.port}/`);
  }

  private initControllers() {
    this.server.registerControllers([this.userController]);
  }

  private initServer() {
    this.server.listen(this.port);
  }
}
