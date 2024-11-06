import http from 'node:http';

import { BaseRouting } from './base-routing.js';
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
      const routers = this.getRouters(controllers);
      this.routing.registerRouters(routers);
      await this.routing.processRoute(client);
    });
  }

  private getRouters(controllers: Controller[]) {
    const routers = controllers.map((controller) => controller.router);
    return routers;
  }

  public listen(port: number) {
    if (!this.server) {
      throw new Error('Cannot start server without controllers');
    }

    this.server.listen(port);
  }
}
