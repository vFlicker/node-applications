import { HttpStatusCode } from '../enums.js';
import { HttpError } from './http.error.js';

export class BadRequestException extends HttpError {
  constructor(message: string) {
    super(HttpStatusCode.BadRequest, message);
  }
}
