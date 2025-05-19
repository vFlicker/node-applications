import { DotenvSchema } from '#src/shared/libs/dotenv-validator/index.js';

export type RestConfigSchema = {
  PORT: number;
  HOST_NAME: string;
  HAS_HORIZONTAL_SCALING: boolean;
};

export const restConfigSchema: DotenvSchema<RestConfigSchema> = {
  PORT: {
    type: 'number',
    default: null,
  },
  HOST_NAME: {
    type: 'string',
    default: null,
  },
  HAS_HORIZONTAL_SCALING: {
    type: 'boolean',
    default: null,
  },
};
