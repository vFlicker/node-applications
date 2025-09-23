import {
  Middleware,
  UnauthorizedAccessException,
} from '#src/shared/libs/rest/index.js';

export const authMiddleware = (): Middleware => {
  return async (client, _params, next) => {
    const token = client.getRequestHeader('Authorization');

    if (!token) {
      return Promise.reject(new UnauthorizedAccessException('Unauthorized'));
    }

    return next();
  };
};
