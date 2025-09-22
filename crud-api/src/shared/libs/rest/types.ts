import { IncomingMessage, ServerResponse } from 'http';

import { HttpMethod } from './enums.js';

export interface Client {
  res: ServerResponse;
  req: IncomingMessage;
  getRequestHeader(name: string): string | undefined;
  getRequestHeaders(name: string): string[] | string | undefined;
  setResponseHeader(name: string, value: string): void;
}

export type Params = RegExpMatchArray | null;
export type Path = string;
export type RouteHandler = (client: Client, params: Params) => Promise<void>;

export type Route = {
  path: Path;
  method: HttpMethod;
  handler: RouteHandler;
  pattern?: RegExp | null;
};

export interface Middleware {
  execute(client: Client, next: () => Promise<void>): Promise<void>;
}

export interface ExceptionFilter {
  canHandle(error: unknown): boolean;
  catch(res: ServerResponse, error: unknown): void;
}
