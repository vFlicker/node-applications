import { BaseRouter } from './BaseRouter.js';
import { Client, Controller, Route, Router } from './types.js';

export abstract class BaseController implements Controller {
  private readonly _router: Router;

  constructor() {
    this._router = new BaseRouter();
  }

  get router() {
    return this._router;
  }

  protected async parseBody<T>({ req }: Client): Promise<T> {
    return new Promise((resolve, reject) => {
      let body = '';

      req.on('data', (chunk: ArrayBuffer) => (body += chunk.toString()));

      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });

      req.on('error', reject);
    });
  }

  public addRoute(route: Route) {
    this._router.addRoute(route);
  }
}
