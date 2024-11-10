import { HttpStatusCode } from '../enums.js';
import { HttpError } from './http.error.js';

export class NotFoundException extends HttpError {
  constructor(message: string) {
    super(HttpStatusCode.NotFound, message);
  }
}
