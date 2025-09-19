import { createServer, Server, ServerResponse } from 'node:http';

import { Controller } from './controller.js';
import { Routing } from './routing.js';
import { ExceptionFilter } from './types.js';

export class RestServer {
  private readonly routing = new Routing();
  private server: Server | null = null;
  private exceptionFilters: ExceptionFilter[] = [];

  public registerControllers(controllers: Controller[]): void {
    this.routing.registerRouters(controllers.map(({ router }) => router));

    this.server = createServer(async (req, res) => {
      try {
        await this.routing.processRoute({ req, res });
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
