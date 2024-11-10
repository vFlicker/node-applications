import http from 'node:http';

import { BaseRouting } from './base-routing.js';
import { HttpStatusCode } from './enums.js';
import { HttpError } from './errors/http.error.js';
import { ValidationException } from './errors/validation.exception.js';
import { Controller, Routing, Server } from './types.js';

export class BaseServer implements Server {
  private readonly routing: Routing;
  private server: http.Server | null = null;

  constructor() {
    this.routing = new BaseRouting();
  }

  public registerControllers(controllers: Controller[]) {
    this.server = http.createServer(async (req, res) => {
      const client = { req, res };
      const routers = this.getRouters(controllers);
      this.routing.registerRouters(routers);

      try {
        await this.routing.processRoute(client);
      } catch (error) {
        this.handleHttpResponseError(res, error);
      }
    });
  }

  private getRouters(controllers: Controller[]) {
    const routers = controllers.map((controller) => controller.router);
    return routers;
  }

  private handleHttpResponseError(res: http.ServerResponse, error: unknown) {
    const defaultHeaders = { 'Content-Type': 'application/json' };

    if (error instanceof ValidationException) {
      const { httpStatusCode, message, errors } = error;
      res.writeHead(httpStatusCode, defaultHeaders);
      res.end(JSON.stringify({ message, errors }));
      return;
    }

    if (error instanceof HttpError) {
      const { httpStatusCode, message } = error;
      res.writeHead(httpStatusCode, defaultHeaders);
      res.end(JSON.stringify({ message }));
      return;
    }

    res.writeHead(HttpStatusCode.InternalServerError, defaultHeaders);
  }

  public listen(port: number) {
    if (!this.server) {
      throw new Error('Cannot start server without controllers');
    }

    this.server.listen(port);
  }
}
