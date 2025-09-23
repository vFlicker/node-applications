import { IncomingMessage, ServerResponse } from 'node:http';

import { HttpMethod, HttpStatusCode } from './enums.js';
import { Client } from './types.js';

export class RestClient implements Client {
  private readonly url: string;
  private readonly method: string;

  constructor(
    public res: ServerResponse,
    public req: IncomingMessage,
  ) {
    this.url = req.url || '';
    this.method = req.method || HttpMethod.Get;
  }

  public sendResponse(data: unknown): void {
    this.res.end(JSON.stringify(data));
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

  public setResponseHeader(name: string, value: string): void {
    this.res.setHeader(name, value);
  }

  public setResponseHeaders(headers: Record<string, string>): void {
    for (const [name, value] of Object.entries(headers)) {
      this.res.setHeader(name, value);
    }
  }

  public setStatusCode(statusCode: HttpStatusCode): void {
    this.res.statusCode = statusCode;
  }

  public getQueryParam(name: string): string | null {
    const url = new URL(this.url);
    return url.searchParams.get(name);
  }

  public getQueryParams(): URLSearchParams {
    const url = new URL(this.url);
    return url.searchParams;
  }
}
