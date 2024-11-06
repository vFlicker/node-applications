import { ArrayValidator } from './validators/array.validator.js';
import { NumberValidator } from './validators/number.validator.js';
import { StringValidator } from './validators/string.validator.js';

export const validator = {
  string() {
    return new StringValidator();
  },
  number() {
    return new NumberValidator();
  },
  array() {
    return new ArrayValidator();
  },
};
