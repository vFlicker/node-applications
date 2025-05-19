import { config } from 'dotenv';

import { DotenvValidator } from '#src/shared/libs/dotenv-validator/index.js';

import { RestConfigSchema, restConfigSchema } from './rest-config.schema.js';

export class RestConfig {
  private readonly config: RestConfigSchema;

  constructor() {
    const result = config();
    if (result.error) {
      throw new Error(`Can't read .env file: ${result.error.message}`);
    }

    const validator = new DotenvValidator(restConfigSchema);
    this.config = validator.validate(process.env);
  }

  get<K extends keyof RestConfigSchema>(key: K): RestConfigSchema[K] {
    return this.config[key];
  }
}
