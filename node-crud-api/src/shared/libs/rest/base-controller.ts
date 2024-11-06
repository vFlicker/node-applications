import { BaseRouter } from './base-router.js';
import { HttpStatusCode } from './enums.js';
import { Client, Controller, Route, Router } from './types.js';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

export abstract class BaseController implements Controller {
  private readonly _router: Router;

  constructor() {
    this._router = new BaseRouter();
  }

  get router(): Router {
    return this._router;
  }

  public async parseBody<T>({ req }: Client): Promise<T> {
    return new Promise((resolve, reject) => {
      let body = '';

      req.on('data', (chunk: ArrayBuffer) => (body += chunk.toString()));

      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });

      req.on('error', reject);
    });
  }

  public addRoute(route: Route): void {
    this._router.addRoute(route);
  }

  public send<T>(client: Client, statusCode: HttpStatusCode, data: T): void {
    client.res.writeHead(statusCode, DEFAULT_HEADERS);
    client.res.end(JSON.stringify(data));
  }

  public created<T>(client: Client, data: T): void {
    this.send(client, HttpStatusCode.Created, data);
  }

  public ok<T>(client: Client, data: T): void {
    this.send(client, HttpStatusCode.Ok, data);
  }

  public noContent(client: Client): void {
    client.res.writeHead(HttpStatusCode.NoContent);
    client.res.end();
  }

  public badRequest(client: Client, errors: unknown): void {
    this.send(client, HttpStatusCode.BadRequest, errors);
  }

  public notFound(client: Client): void {
    client.res.writeHead(HttpStatusCode.NotFound);
    client.res.end();
  }
}
