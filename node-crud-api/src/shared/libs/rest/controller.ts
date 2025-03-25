import { HttpStatusCode } from './enums.js';
import { BadRequestException } from './errors/bad-request.exception.js';
import { Router } from './router.js';
import { Client, Route } from './types.js';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

export abstract class Controller {
  private readonly _router = new Router();

  get router(): Router {
    return this._router;
  }

  public async parseBody<T>({ req }: Client): Promise<T> {
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      req.on('data', (chunk) => chunks.push(chunk));

      req.on('end', () => {
        try {
          const body = Buffer.concat(chunks as Uint8Array[]).toString('utf-8');
          resolve(JSON.parse(body));
        } catch (err) {
          reject(new BadRequestException('Invalid JSON'));
        }
      });

      req.on('error', reject);
    });
  }

  public addRoute(route: Route): void {
    this._router.addRoute({
      ...route,
      handler: route.handler.bind(this),
    });
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

  public notFound(client: Client, errors: unknown): void {
    this.send(client, HttpStatusCode.NotFound, errors);
  }
}
