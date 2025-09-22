import { IncomingMessage, ServerResponse } from 'node:http';

import { Client } from './types.js';

export class RestClient implements Client {
  constructor(
    public res: ServerResponse,
    public req: IncomingMessage,
  ) {}

  getRequestHeader(name: string): string | undefined {
    const value = this.req.headers[name.toLowerCase()];
    if (Array.isArray(value)) return value[0];
    return value;
  }

  getRequestHeaders(name: string): string[] {
    const value = this.req.headers[name.toLowerCase()];
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  setResponseHeader(name: string, value: string): void {
    this.res.setHeader(name, value);
  }
}
