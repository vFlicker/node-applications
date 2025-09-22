import { ServerResponse } from 'node:http';

import {
  ExceptionFilter,
  HttpStatusCode,
} from '#src/shared/libs/rest/index.js';

export class DefaultExceptionFilter implements ExceptionFilter {
  public canHandle(_error: unknown): boolean {
    return true;
  }

  public catch(res: ServerResponse, _error: unknown): void {
    const defaultHeaders = { 'Content-Type': 'application/json' };
    res.writeHead(HttpStatusCode.InternalServerError, defaultHeaders);
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
}
