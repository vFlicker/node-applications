import { HttpMethod } from './enums.js';
import { Middleware, Route, RouteHandler } from './types.js';

export class Router {
  public routes: Route[] = [];
  private middlewares: Middleware[] = [];

  public addRoute(route: Route): void {
    this.routes.push(route);
  }

  public use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  public get(path: string, handler: RouteHandler): void {
    this.addRoute({ path, method: HttpMethod.Get, handler });
  }

  public post(path: string, handler: RouteHandler): void {
    this.addRoute({ path, method: HttpMethod.Post, handler });
  }

  public put(path: string, handler: RouteHandler): void {
    this.addRoute({ path, method: HttpMethod.Put, handler });
  }

  public delete(path: string, handler: RouteHandler): void {
    this.addRoute({ path, method: HttpMethod.Delete, handler });
  }

  public getMiddlewares(): Middleware[] {
    return [...this.middlewares];
  }
}
