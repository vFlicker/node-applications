import { StatusCode } from '../constants.js';
import { AuthenticationError } from '../helpers/index.js';

export const errorMiddleware = (error, _req, res, _next) => {
  if (error instanceof AuthenticationError) {
    res.status(StatusCode.UNAUTHORIZED).json({ message: error.message });
    return;
  }

  const status = error.status || StatusCode.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Something went wrong.';
  res.status(status).json({ message: message });
};
