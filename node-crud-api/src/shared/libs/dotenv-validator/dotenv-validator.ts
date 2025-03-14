import {
  DotenvSchema,
  SupportedValue,
  ValidatorMap,
} from './dotenv-validator.types.js';
import {
  BooleanValidator,
  NumberValidator,
  StringValidator,
} from './validators.js';

export class DotenvValidator<T extends Record<string, SupportedValue>> {
  private readonly schema: DotenvSchema<T>;
  private readonly validators: ValidatorMap<T>;
  private config: Partial<T> = {};

  constructor(schema: DotenvSchema<T>) {
    this.schema = schema;
    this.validators = {
      number: new NumberValidator(),
      boolean: new BooleanValidator(),
      string: new StringValidator(),
    };
  }

  public validate(env: NodeJS.ProcessEnv): T {
    for (const key in this.schema) {
      if (Object.prototype.hasOwnProperty.call(this.schema, key)) {
        const options = this.schema[key];
        const envValue = env[key];

        if (envValue === undefined) {
          if (options.default === null) {
            throw new Error(`Missing required environment variable: ${key}`);
          } else {
            this.config[key] = options.default;
            continue;
          }
        }

        const validator = this.validators[options.type];
        if (!validator) throw new Error(`Unsupported type: ${options.type}`);

        const result = validator.validate(envValue, key);
        if (!result.valid) throw new Error(result.error);

        this.config[key] = result.value as T[Extract<keyof T, string>];
      }
    }

    return this.config as T;
  }
}
