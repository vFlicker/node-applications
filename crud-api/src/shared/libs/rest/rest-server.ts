import { createServer, Server, ServerResponse } from 'node:http';

import { RestClient } from './client.js';
import { Controller } from './controller.js';
import { executeMiddlewareChain } from './execute-middleware-chain.js';
import { Routing } from './routing.js';
import { ExceptionFilter, Middleware } from './types.js';

export class RestServer {
  private server: Server | null = null;
  private readonly routing = new Routing();
  private readonly globalMiddlewares: Middleware[] = [];
  private readonly exceptionFilters: ExceptionFilter[] = [];

  public async registerControllers(controllers: Controller[]): Promise<void> {
    this.routing.registerRouters(controllers.map(({ router }) => router));

    this.server = createServer(async (req, res) => {
      try {
        const client = await RestClient.getInstance(req, res);

        await executeMiddlewareChain(
          this.globalMiddlewares,
          client,
          async () => {
            await this.routing.processRoute(client);
          },
        );

        res.on('finish', () => client.saveSession());
      } catch (err) {
        this.handleException(res, err);
      }
    });
  }

  private handleException(res: ServerResponse, error: unknown): void {
    for (const filter of this.exceptionFilters) {
      if (filter.canHandle(error)) {
        filter.catch(res, error);
        return;
      }
    }

    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }

  public registerMiddlewares(middlewares: Middleware[]): void {
    this.globalMiddlewares.push(...middlewares);
  }

  public registerExceptionFilters(filters: ExceptionFilter[]): void {
    this.exceptionFilters.push(...filters);
  }

  public listen(port: number): void {
    if (!this.server) {
      throw new Error('Cannot start server without controllers');
    }

    this.server.listen(port);
  }
}
