import http from 'node:http';

import { BaseRouting } from './BaseRouting.js';
import { Controller, Server } from './types.js';

export class BaseServer implements Server {
  private readonly routing: BaseRouting;
  private server: http.Server | null = null;

  constructor() {
    this.routing = new BaseRouting();
  }

  public registerControllers(controllers: Controller[]) {
    this.server = http.createServer(async (req, res) => {
      const client = { req, res };
      const routers = controllers.map((controller) => controller.router);
      this.routing.registerRouters(routers);
      const result = await this.routing.processRoute(client);
      res.end(result);
    });
  }

  public listen(port: number) {
    if (!this.server) {
      throw new Error('Cannot start server without controllers');
    }

    this.server.listen(port);
  }
}
