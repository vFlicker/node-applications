import { IncomingMessage, ServerResponse } from 'http';

import { HttpMethod } from './enums.js';

export type Client = {
  res: ServerResponse;
  req: IncomingMessage;
};

export type Params = RegExpMatchArray | null;
export type Path = string;
export type RouteHandler = (client: Client, params: Params) => Promise<void>;

export type Route = {
  path: Path;
  method: HttpMethod;
  handler: RouteHandler;
  pattern?: RegExp | null;
};
