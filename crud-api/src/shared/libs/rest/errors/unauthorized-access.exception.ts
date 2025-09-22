import { HttpStatusCode } from '../enums.js';
import { HttpError } from './http.error.js';

export class UnauthorizedAccessException extends HttpError {
  constructor(message: string) {
    super(HttpStatusCode.Unauthorized, message);
  }
}
