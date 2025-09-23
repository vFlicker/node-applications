import { HttpMethod } from './enums.js';
import { Middleware, Route, RouteHandler, RouteHandlerArray } from './types.js';

export class Router {
  public readonly routes: Route[] = [];

  public get(path: string, ...handlers: RouteHandlerArray): void {
    this.registerRoute(path, HttpMethod.Get, handlers);
  }

  public post(path: string, ...handlers: RouteHandlerArray): void {
    this.registerRoute(path, HttpMethod.Post, handlers);
  }

  public put(path: string, ...handlers: RouteHandlerArray): void {
    this.registerRoute(path, HttpMethod.Put, handlers);
  }

  public delete(path: string, ...handlers: RouteHandlerArray): void {
    this.registerRoute(path, HttpMethod.Delete, handlers);
  }

  private registerRoute(
    path: string,
    method: HttpMethod,
    handlers: RouteHandlerArray,
  ): void {
    if (handlers.length === 0) {
      throw new Error(`No handlers provided for route: ${method} ${path}`);
    }

    const handler = handlers[handlers.length - 1] as RouteHandler;
    const middlewares = handlers.slice(0, -1) as Middleware[];

    this.routes.push({ path, method, handler, middlewares });
  }
}
