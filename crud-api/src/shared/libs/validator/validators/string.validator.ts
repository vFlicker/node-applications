import { ValidatorFieldError } from '../types.js';
import { Validator } from './validator.interface.js';

export class StringValidator implements Validator {
  private isRequired = false;
  private minLength?: number;
  private maxLength?: number;

  required() {
    this.isRequired = true;
    return this;
  }

  min(length: number) {
    this.minLength = length;
    return this;
  }

  max(length: number) {
    this.maxLength = length;
    return this;
  }

  validate(fieldName: string, value: unknown): ValidatorFieldError[] {
    const errors: ValidatorFieldError[] = [];

    if (!value) {
      if (this.isRequired) errors.push(`Field "${fieldName}" is required`);
      return errors;
    }

    if (typeof value !== 'string') {
      errors.push(`Field "${fieldName}" must be a string`);
      return errors;
    }

    if (this.minLength && value.length < this.minLength) {
      errors.push(
        `Field "${fieldName}" must contain at least ${this.minLength} characters`,
      );
    }

    if (this.maxLength && value.length > this.maxLength) {
      errors.push(
        `Field "${fieldName}" must not exceed ${this.maxLength} characters`,
      );
    }

    return errors;
  }
}
