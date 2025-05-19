import { ValidatorFieldError } from '../types.js';

export interface Validator {
  validate(fieldName: string, value: unknown): ValidatorFieldError[];
}
