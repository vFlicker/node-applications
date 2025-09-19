import { ServerResponse } from 'node:http';

import { ExceptionFilter, ValidationException } from '../libs/rest/index.js';

export class ValidationExceptionFilter implements ExceptionFilter {
  public canHandle(error: unknown): boolean {
    return error instanceof ValidationException;
  }

  public catch(res: ServerResponse, error: ValidationException): void {
    const defaultHeaders = { 'Content-Type': 'application/json' };
    const { httpStatusCode, message, errors } = error;
    res.writeHead(httpStatusCode, defaultHeaders);
    res.end(JSON.stringify({ message, errors }));
  }
}
