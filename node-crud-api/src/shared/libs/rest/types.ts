import { IncomingMessage, ServerResponse } from 'http';

import { HttpMethod } from './enums.js';

export type Client = {
  res: ServerResponse;
  req: IncomingMessage;
  state?: Record<string, any>; // For middleware state sharing
};

export type Params = RegExpMatchArray | null;
export type Path = string;
export type RouteHandler = (client: Client, params: Params) => Promise<unknown>;

export type Route = {
  path: Path;
  method: HttpMethod;
  handler: RouteHandler;
};

export type NextFunction = () => Promise<void>;
export type Middleware = (client: Client, next: NextFunction) => Promise<void>;
