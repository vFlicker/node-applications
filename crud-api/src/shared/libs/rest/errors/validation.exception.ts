import { ValidatorResponse } from '../../validator/types.js';
import { HttpStatusCode } from '../enums.js';
import { HttpError } from './http.error.js';

export class ValidationException extends HttpError {
  public errors: ValidatorResponse = [];

  constructor(errors: ValidatorResponse) {
    super(HttpStatusCode.BadRequest, 'Validation error');
    this.errors = errors;
  }
}
