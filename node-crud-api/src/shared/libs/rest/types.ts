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
