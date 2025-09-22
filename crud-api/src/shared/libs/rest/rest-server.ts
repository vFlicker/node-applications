import { createServer, Server, ServerResponse } from 'node:http';

import { RestClient } from './client.js';
import { Controller } from './controller.js';
import { Routing } from './routing.js';
import { Client, ExceptionFilter, Middleware } from './types.js';

export class RestServer {
  private server: Server | null = null;
  private readonly routing = new Routing();
  private readonly globalMiddlewares: Middleware[] = [];
  private readonly exceptionFilters: ExceptionFilter[] = [];

  public registerControllers(controllers: Controller[]): void {
    this.routing.registerRouters(controllers.map(({ router }) => router));

    this.server = createServer(async (req, res) => {
      try {
        const client = new RestClient(res, req);

        await this.executeMiddlewaresChain(client, async () => {
          await this.routing.processRoute(client);
        });
      } catch (err) {
        this.handleException(res, err);
      }
    });
  }

  private async executeMiddlewaresChain(
    client: Client,
    finalHandler: () => Promise<void>,
  ): Promise<void> {
    const middlewares = [...this.globalMiddlewares];

    const executeNext = async (index: number): Promise<void> => {
      if (index < middlewares.length) {
        const currentMiddleware = middlewares[index];
        await currentMiddleware.execute(client, () => executeNext(index + 1));
      } else {
        await finalHandler();
      }
    };

    await executeNext(0);
  }

  private handleException(res: ServerResponse, error: unknown): void {
    for (const filter of this.exceptionFilters) {
      if (filter.canHandle(error)) {
        filter.catch(res, error);
        return;
      }
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
