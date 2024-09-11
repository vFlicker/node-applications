import { IncomingMessage, ServerResponse } from 'http';

import { HttpMethod } from './enums.js';

export type Client = {
  res: ServerResponse;
  req: IncomingMessage;
};

export type Params = RegExpMatchArray | null;
type Path = string;
export type RouteHandler = (client: Client, params: Params) => Promise<unknown>;

export type Route = {
  path: Path;
  method: HttpMethod;
  handler: RouteHandler;
};

export interface Router {
  routes: Route[];
  addRoute(route: Route): void;
}

export interface Routing {
  registerRouters(routers: Router[]): void;
  processRoute(client: Client): Promise<string>;
}

export interface Controller {
  readonly router: Router;
  addRoute(route: Route): void;
}

export interface Server {
  registerControllers(controllers: Controller[]): void;
  listen(port: number): void;
}
