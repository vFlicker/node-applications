import { IncomingMessage, ServerResponse } from 'http';

import { HttpMethod, HttpStatusCode } from './enums.js';

export type SerializedSession = {
  token: string;
};

export interface Session {
  save(): void;
}

export interface Client {
  res: ServerResponse;
  req: IncomingMessage;
  setToken(token: string): void;
  getToken(): string | undefined;
  deleteToken(): void;
  setSession(session: Session): void;
  getSession(): Session | null;
  deleteSession(): void;
  saveSession(): void;
  sendResponse<T>(data: T): void;
  getUrl(): string;
  getMethod(): string;
  getRequestHeader(name: string): string | undefined;
  getRequestHeaders(name: string): string[];
  setResponseHeader(name: string, value: string): void;
  setResponseHeaders(headers: Record<string, string>): void;
  setStatusCode(statusCode: HttpStatusCode): void;
  setCookie(name: string, val: string, httpOnly?: boolean): void;
  getCookie(name: string): string | undefined;
  deleteCookie(name: string): void;
  sendCookie(): void;
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
