import { ArrayValidator } from './validators/array.validator.js';
import { NumberValidator } from './validators/number.validator.js';
import { StringValidator } from './validators/string.validator.js';
import { UuidValidator } from './validators/uuid.validator.js';

export const validator = {
  string() {
    return new StringValidator();
  },
  uuid() {
    return new UuidValidator();
  },
  number() {
    return new NumberValidator();
  },
  array() {
    return new ArrayValidator();
  },
};
