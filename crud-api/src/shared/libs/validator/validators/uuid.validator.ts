import { ValidatorFieldError } from '../types.js';
import { Validator } from './validator.interface.js';

export class UuidValidator implements Validator {
  validate(fieldName: string, value: unknown): ValidatorFieldError[] {
    const errors: ValidatorFieldError[] = [];

    if (!value) {
      errors.push(`Field "${fieldName}" is required`);
      return errors;
    }

    if (typeof value !== 'string') {
      errors.push(`Field "${fieldName}" must be a string`);
      return errors;
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      errors.push(`Field "${fieldName}" must be a valid UUID`);
    }

    return errors;
  }
}
