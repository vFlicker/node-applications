import { Client, Middleware } from '#src/shared/libs/rest/index.js';

export class CorsMiddleware implements Middleware {
  private readonly allowedOrigins: string[];

  constructor(allowedOrigins: string[] = []) {
    this.allowedOrigins = allowedOrigins;
  }

  public execute(client: Client, next: () => Promise<void>): Promise<void> {
    const origin = client.getRequestHeader('Origin');

    if (origin && this.allowedOrigins.includes(origin)) {
      client.setResponseHeader('Access-Control-Allow-Origin', origin);
      client.setResponseHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
      );
      client.setResponseHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE',
      );
    }

    if (client.req.method === 'OPTIONS') {
      client.res.writeHead(204);
      client.res.end();
      return Promise.resolve();
    }

    return next();
  }
}
