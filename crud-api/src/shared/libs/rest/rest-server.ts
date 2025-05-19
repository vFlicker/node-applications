import { createServer, Server, ServerResponse } from 'node:http';

import { Controller } from './controller.js';
import { HttpStatusCode } from './enums.js';
import { HttpError } from './errors/http.error.js';
import { ValidationException } from './errors/validation.exception.js';
import { Routing } from './routing.js';

export class RestServer {
  private readonly routing = new Routing();
  private server: Server | null = null;

  public registerControllers(controllers: Controller[]): void {
    this.routing.registerRouters(controllers.map(({ router }) => router));

    this.server = createServer(async (req, res) => {
      try {
        await this.routing.processRoute({ req, res });
      } catch (err) {
        this.handleHttpResponseError(res, err);
      }
    });
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
