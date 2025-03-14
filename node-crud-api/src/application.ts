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
    this.server.registerControllers([this.userController]);
    this.server.listen(this.port);
    console.log(`Server running at http://localhost:${this.port}/`);
  }
}
