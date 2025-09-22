import { HttpMethod } from './enums.js';
import { Middleware, Route, RouteHandler } from './types.js';

export class Router {
  public readonly routes: Route[] = [];

  public get(path: string, ...handlers: (Middleware | RouteHandler)[]): void {
    const middlewares = handlers.slice(0, -1) as Middleware[];
    const handler = handlers[handlers.length - 1] as RouteHandler;
    this.addRoute({ path, method: HttpMethod.Get, handler, middlewares });
  }

  public post(path: string, ...handlers: (Middleware | RouteHandler)[]): void {
    const middlewares = handlers.slice(0, -1) as Middleware[];
    const handler = handlers[handlers.length - 1] as RouteHandler;
    this.addRoute({ path, method: HttpMethod.Post, handler, middlewares });
  }

  public put(path: string, ...handlers: (Middleware | RouteHandler)[]): void {
    const middlewares = handlers.slice(0, -1) as Middleware[];
    const handler = handlers[handlers.length - 1] as RouteHandler;
    this.addRoute({ path, method: HttpMethod.Put, handler, middlewares });
  }

  public delete(
    path: string,
    ...handlers: (Middleware | RouteHandler)[]
  ): void {
    const middlewares = handlers.slice(0, -1) as Middleware[];
    const handler = handlers[handlers.length - 1] as RouteHandler;
    this.addRoute({ path, method: HttpMethod.Delete, handler, middlewares });
  }

  private addRoute(route: Route): void {
    this.routes.push(route);
  }
}
