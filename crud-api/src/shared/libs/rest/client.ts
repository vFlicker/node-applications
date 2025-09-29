import { IncomingMessage, ServerResponse } from 'node:http';

import { Cookie } from './cookie.js';
import { HttpMethod, HttpStatusCode } from './enums.js';
import { RestSession } from './session/session.js';
import { Client, Session } from './types.js';

export class RestClient implements Client {
  public req: IncomingMessage;
  public res: ServerResponse;
  private token: string | undefined;
  private session: Session | null;
  private readonly url: string;
  private readonly method: string;
  private readonly cookieManager: Cookie;

  constructor(req: IncomingMessage, res: ServerResponse) {
    this.req = req;
    this.res = res;
    this.token = undefined;
    this.session = null;
    this.url = req.url || '';
    this.method = req.method || HttpMethod.Get;

    const host = this.parseHost(this.getRequestHeader('host') || '');
    this.cookieManager = new Cookie(host, this.getRequestHeader('cookie'));
  }

  static async getInstance(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<Client> {
    const client = new RestClient(req, res);
    try {
      await RestSession.restore(client);
    } catch (error) {
      console.error('Failed to restore session:', error);
    }
    return client;
  }

  public getUrl(): string {
    return this.url;
  }

  public getMethod(): string {
    return this.method;
  }

  public getRequestHeader(name: string): string | undefined {
    const value = this.req.headers[name.toLowerCase()];
    if (Array.isArray(value)) return value[0];
    return value;
  }

  public getRequestHeaders(name: string): string[] {
    const value = this.req.headers[name.toLowerCase()];
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  public setResponseHeader(name: string, value: string | string[]): void {
    this.res.setHeader(name, value);
  }

  public setResponseHeaders(headers: Record<string, string | string[]>): void {
    for (const [name, value] of Object.entries(headers)) {
      this.res.setHeader(name, value);
    }
  }

  public sendResponse<T>(data: T): void {
    this.sendCookie();
    this.res.end(JSON.stringify(data));
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public getToken(): string | undefined {
    return this.token;
  }

  public deleteToken(): void {
    this.token = undefined;
  }

  public setSession(session: Session): void {
    this.session = session;
  }

  public getSession(): Session | null {
    return this.session;
  }

  public deleteSession(): void {
    this.session = null;
  }

  public saveSession(): void {
    this.session?.save();
  }

  public setStatusCode(statusCode: HttpStatusCode): void {
    this.res.statusCode = statusCode;
  }

  public setCookie(name: string, val: string, httpOnly: boolean = false): void {
    this.cookieManager.set(name, val, httpOnly);
  }

  public getCookie(name: string): string | undefined {
    return this.cookieManager.get(name);
  }

  public deleteCookie(name: string): void {
    this.cookieManager.delete(name);
  }

  public sendCookie(): void {
    this.cookieManager.send(this.res);
  }

  private parseHost(host: string): string {
    if (!host) return 'no-host-name-in-http-headers';
    const portOffset = host.indexOf(':');
    if (portOffset > -1) host = host.slice(0, portOffset);
    return host;
  }
}
