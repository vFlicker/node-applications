import { HttpStatusCode } from './enums.js';
import { BadRequestException } from './errors/bad-request.exception.js';
import { Router } from './router.js';
import { Client, RouteHandlerArray } from './types.js';

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

  protected get(path: string, ...handlers: RouteHandlerArray): void {
    this.router.get(path, ...this.prepareHandlers(handlers));
  }

  protected post(path: string, ...handlers: RouteHandlerArray): void {
    this.router.post(path, ...this.prepareHandlers(handlers));
  }

  protected put(path: string, ...handlers: RouteHandlerArray): void {
    this.router.put(path, ...this.prepareHandlers(handlers));
  }

  protected delete(path: string, ...handlers: RouteHandlerArray): void {
    this.router.delete(path, ...this.prepareHandlers(handlers));
  }

  private prepareHandlers(handlers: RouteHandlerArray): RouteHandlerArray {
    return handlers.map((handler) => handler.bind(this));
  }

  protected created<T>(client: Client, data: T): void {
    this.send(client, HttpStatusCode.Created, data);
  }

  protected ok<T>(client: Client, data: T): void {
    this.send(client, HttpStatusCode.Ok, data);
  }

  protected noContent(client: Client): void {
    this.send(client, HttpStatusCode.NoContent, null);
  }

  protected badRequest(client: Client, errors: unknown): void {
    this.send(client, HttpStatusCode.BadRequest, errors);
  }

  protected notFound(client: Client, errors: unknown): void {
    this.send(client, HttpStatusCode.NotFound, errors);
  }

  protected send<T>(client: Client, statusCode: HttpStatusCode, data: T): void {
    client.setResponseHeaders(DEFAULT_HEADERS);
    client.setStatusCode(statusCode);
    client.sendResponse(data);
  }
}
