import { validator } from '#src/shared/libs/validator/validator.js';

export const userIdSchema = {
  id: validator.number().required(),
};
