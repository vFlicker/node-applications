import { HttpMethod } from './enums.js';
import { Route, RouteHandler } from './types.js';

export class Router {
  public readonly routes: Route[] = [];

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

  private addRoute(route: Route): void {
    this.routes.push(route);
  }
}
