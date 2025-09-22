import { ServerResponse } from 'node:http';

import { ExceptionFilter, HttpError } from '#src/shared/libs/rest/index.js';

export class HttpErrorFilter implements ExceptionFilter {
  public canHandle(error: unknown): boolean {
    return error instanceof HttpError;
  }

  public catch(res: ServerResponse, error: HttpError): void {
    const defaultHeaders = { 'Content-Type': 'application/json' };
    const { httpStatusCode, message } = error;
    res.writeHead(httpStatusCode, defaultHeaders);
    res.end(JSON.stringify({ message }));
  }
}
