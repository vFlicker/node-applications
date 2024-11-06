import { ValidatorFieldError } from '../types.js';
import { Validator } from './validator.interface.js';

export class NumberValidator implements Validator {
  private isRequired = false;
  private minValue?: number;
  private maxValue?: number;

  required() {
    this.isRequired = true;
    return this;
  }

  min(value: number) {
    this.minValue = value;
    return this;
  }

  max(value: number) {
    this.maxValue = value;
    return this;
  }

  validate(fieldName: string, value: unknown): ValidatorFieldError[] {
    const errors: ValidatorFieldError[] = [];

    if (!value) {
      if (this.isRequired) errors.push(`Field "${fieldName}" is required`);
      return errors;
    }

    if (typeof value !== 'number') {
      errors.push(`Field "${fieldName}" must be a number`);
      return errors;
    }

    if (this.minValue && value < this.minValue) {
      errors.push(`Field "${fieldName}" must be at least ${this.minValue}`);
    }

    if (this.maxValue && value > this.maxValue) {
      errors.push(`Field "${fieldName}" must not exceed ${this.maxValue}`);
    }

    return errors;
  }
}
