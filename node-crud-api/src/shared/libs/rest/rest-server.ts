import { createServer, Server, ServerResponse } from 'node:http';

import { Controller } from './controller.js';
import { HttpStatusCode } from './enums.js';
import { HttpError } from './errors/http.error.js';
import { ValidationException } from './errors/validation.exception.js';
import { Routing } from './routing.js';
import { Middleware } from './types.js';

type ErrorHandler = (res: ServerResponse, error: unknown) => void;

export class RestServer {
  private readonly routing = new Routing();
  private server: Server | null = null;
  private customErrorHandler: ErrorHandler | null = null;

  public use(middleware: Middleware): void {
    this.routing.use(middleware);
  }

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

  public setErrorHandler(handler: ErrorHandler): void {
    this.customErrorHandler = handler;
  }

  private handleHttpResponseError(res: ServerResponse, error: unknown): void {
    if (this.customErrorHandler) {
      this.customErrorHandler(res, error);
      return;
    }

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
    res.end(
      JSON.stringify({
        message: 'Internal Server Error',
        error: error instanceof Error ? error.message : String(error),
      }),
    );
  }

  public listen(port: number, callback?: () => void): void {
    if (!this.server) {
      throw new Error('Cannot start server without controllers');
    }

    this.server.listen(port, callback);
  }

  public close(callback?: (err?: Error) => void): void {
    if (!this.server) {
      if (callback) callback();
      return;
    }

    this.server.close(callback);
  }
}
