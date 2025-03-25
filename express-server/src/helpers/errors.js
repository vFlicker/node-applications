import { StatusCode } from '../constants.js';

export class AuthenticationError {
  constructor() {
    this.message = 'Email or password is incorrect.';
    this.status = StatusCode.UNAUTHORIZED;
  }
}
