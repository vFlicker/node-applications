import { validator } from '#src/shared/libs/validator/index.js';

export const updateUserSchema = {
  username: validator.string().required(),
  age: validator.number().required().min(18).max(60),
  hobbies: validator.array().required(),
};
