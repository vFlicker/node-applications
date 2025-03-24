import http, { ServerResponse } from 'node:http';

import { Controller } from './controller.js';
import { HttpStatusCode } from './enums.js';
import { HttpError } from './errors/http.error.js';
import { ValidationException } from './errors/validation.exception.js';
import { Router } from './router.js';
import { Routing } from './routing.js';

export class Server {
  private readonly routing = new Routing();
  private server: http.Server | null = null;

  // THINK: чи нормально, що немає конструктору?

  public registerControllers(controllers: Controller[]): void {
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

  private getRouters(controllers: Controller[]): Router[] {
    const routers = controllers.map((controller) => controller.router);
    return routers;
  }

  // THINK: здається, що ми не можемо в фреймворку вирішувати як обробляти помилки.
  // ми повинні визначати таку логіку десь в іншому місці
  private handleHttpResponseError(res: ServerResponse, error: unknown): void {
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

  public listen(port: number): void {
    if (!this.server) {
      throw new Error('Cannot start server without controllers');
    }

    this.server.listen(port);
  }
}
