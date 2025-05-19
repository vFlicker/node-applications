import { ValidatorResponse } from './types.js';
import { Validator } from './validators/validator.interface.js';

export function validate(
  data: Record<string, unknown>,
  schema: Record<string, Validator>,
): ValidatorResponse {
  const errors: ValidatorResponse = [];

  for (const fieldName in schema) {
    const validator = schema[fieldName];
    const value = data[fieldName];
    const fieldErrors = validator.validate(fieldName, value);
    if (fieldErrors.length > 0) {
      errors.push({ field: fieldName, messages: fieldErrors });
    }
  }

  return errors;
}
