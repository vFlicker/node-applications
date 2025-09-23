import { IncomingMessage, ServerResponse } from 'http';

import { HttpMethod, HttpStatusCode } from './enums.js';

export interface Client {
  res: ServerResponse;
  req: IncomingMessage;
  sendResponse<T>(data: T): void;
  getUrl(): string;
  getMethod(): string;
  getRequestHeader(name: string): string | undefined;
  getRequestHeaders(name: string): string[];
  setResponseHeader(name: string, value: string): void;
  setResponseHeaders(headers: Record<string, string>): void;
  setStatusCode(statusCode: HttpStatusCode): void;
  getQueryParam(name: string): string | null;
  getQueryParams(): URLSearchParams;
}

export type Params = RegExpMatchArray | null;
export type Path = string;
export type RouteHandler = (client: Client, params: Params) => Promise<void>;

export type Middleware = (
  client: Client,
  params: Params,
  next: () => Promise<void>,
) => Promise<void>;

export type RouteHandlerArray = Array<Middleware | RouteHandler>;

export type Route = {
  path: Path;
  method: HttpMethod;
  handler: RouteHandler;
  middlewares?: Middleware[];
  pattern?: RegExp | null;
};

export interface ExceptionFilter {
  canHandle(error: unknown): boolean;
  catch(res: ServerResponse, error: unknown): void;
}
