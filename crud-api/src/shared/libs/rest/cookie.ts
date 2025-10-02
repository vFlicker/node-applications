import { ServerResponse } from 'node:http';

const UNIX_EPOCH = 'Thu, 01 Jan 1970 00:00:00 GMT';
const COOKIE_EXPIRE = 'Fri, 01 Jan 2100 00:00:00 GMT';
const COOKIE_DELETE = `=deleted; Expires=${UNIX_EPOCH}; Path=/; Domain=`;

export class Cookie {
  private readonly cookies: Record<string, string> = {};
  private readonly preparedCookies: string[] = [];
  private readonly host: string;

  constructor(host: string, cookieHeader?: string) {
    this.host = host;
    if (cookieHeader) this.parseCookieHeader(cookieHeader);
  }

  private parseCookieHeader(cookieHeader: string): void {
    const cookieParts = cookieHeader.split(';');
    for (const cookiePair of cookieParts) {
      const parts = cookiePair.split('=');
      const key = parts[0].trim();
      const val = parts[1] || '';
      this.cookies[key] = val.trim();
    }
  }

  public set(name: string, val: string, httpOnly: boolean = false): void {
    const expires = `expires=${COOKIE_EXPIRE}`;
    let cookie = `${name}=${val}; ${expires}; Path=/; Domain=${this.host}`;
    if (httpOnly) cookie += '; HttpOnly';
    const sameSite = 'SameSite=None';
    const secure = 'Secure';
    cookie += `; ${sameSite}; ${secure}`;
    this.preparedCookies.push(cookie);
  }

  public get(name: string): string | undefined {
    return this.cookies[name];
  }

  public delete(name: string): void {
    this.preparedCookies.push(name + COOKIE_DELETE + this.host);
  }

  public send(res: ServerResponse): void {
    if (this.preparedCookies.length && !res.headersSent) {
      res.setHeader('Set-Cookie', this.preparedCookies);
    }
  }
}
