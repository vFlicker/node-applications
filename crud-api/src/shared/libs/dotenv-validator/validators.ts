import {
  SupportedValue,
  ValidationResult,
  Validator,
} from './dotenv-validator.types.js';

export class NumberValidator<T extends Record<string, SupportedValue>>
  implements Validator<T>
{
  validate(value: string, key: keyof T): ValidationResult<number> {
    const num = Number(value);
    if (isNaN(num)) {
      return {
        valid: false,
        error: `Invalid value for ${String(key)}. Expected a number.`,
      };
    }
    return { valid: true, value: num };
  }
}

export class BooleanValidator<T extends Record<string, SupportedValue>>
  implements Validator<T>
{
  validate(value: string, key: keyof T): ValidationResult<boolean> {
    if (!['true', 'false'].includes(value.toLowerCase())) {
      return {
        valid: false,
        error: `Invalid value for ${String(key)}. Expected a boolean.`,
      };
    }
    return { valid: true, value: value.toLowerCase() === 'true' };
  }
}

export class StringValidator<T extends Record<string, SupportedValue>>
  implements Validator<T>
{
  validate(value: string): ValidationResult<string> {
    return { valid: true, value };
  }
}
