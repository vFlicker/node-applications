type SupportedType = 'number' | 'string' | 'boolean';
export type SupportedValue = number | string | boolean;

type SchemaOption<T> = {
  type: SupportedType;
  default: T | null;
};

export type DotenvSchema<T extends Record<string, SupportedValue>> = {
  [K in keyof T]: SchemaOption<T[K]>;
};

export interface Validator<T extends Record<string, SupportedValue>> {
  validate(value: string, key: keyof T): ValidationResult<SupportedValue>;
}

export type ValidationResult<T> = {
  valid: boolean;
  value?: T;
  error?: string;
};

export type ValidatorMap<T extends Record<string, SupportedValue>> = {
  [key in SupportedType]: Validator<T>;
};
