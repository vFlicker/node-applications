import { HttpStatusCode } from './enums.js';
import { BadRequestException } from './errors/bad-request.exception.js';
import { Router } from './router.js';
import { Client, RouteHandler } from './types.js';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

export abstract class Controller {
  public readonly router = new Router();

  protected async parseBody<T>({ req }: Client): Promise<T> {
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      req.on('data', (chunk) => {
        chunks.push(chunk);
      });

      req.on('end', () => {
        try {
          const body = Buffer.concat(chunks as Uint8Array[]).toString('utf-8');
          if (!body) resolve({} as T);
          else resolve(JSON.parse(body));
        } catch (err) {
          reject(new BadRequestException('Invalid JSON'));
        }
      });

      req.on('error', reject);
    });
  }

  protected get(path: string, handler: RouteHandler): void {
    this.router.get(path, handler.bind(this));
  }

  protected post(path: string, handler: RouteHandler): void {
    this.router.post(path, handler.bind(this));
  }

  protected put(path: string, handler: RouteHandler): void {
    this.router.put(path, handler.bind(this));
  }

  protected delete(path: string, handler: RouteHandler): void {
    this.router.delete(path, handler.bind(this));
  }

  protected send<T>(client: Client, statusCode: HttpStatusCode, data: T): void {
    client.res.writeHead(statusCode, DEFAULT_HEADERS);
    client.res.end(JSON.stringify(data));
  }

  protected created<T>(client: Client, data: T): void {
    this.send(client, HttpStatusCode.Created, data);
  }

  protected ok<T>(client: Client, data: T): void {
    this.send(client, HttpStatusCode.Ok, data);
  }

  protected noContent(client: Client): void {
    client.res.writeHead(HttpStatusCode.NoContent);
    client.res.end();
  }

  protected badRequest(client: Client, errors: unknown): void {
    this.send(client, HttpStatusCode.BadRequest, errors);
  }

  protected notFound(client: Client, errors: unknown): void {
    this.send(client, HttpStatusCode.NotFound, errors);
  }
}
