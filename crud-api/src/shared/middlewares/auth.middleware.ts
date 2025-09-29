import {
  Middleware,
  UnauthorizedAccessException,
} from '#src/shared/libs/rest/index.js';

export const authMiddleware = (): Middleware => {
  return async (client, _params, next) => {
    const session = client.getSession();
    if (!session) {
      return Promise.reject(new UnauthorizedAccessException('Unauthorized'));
    }

    return next();
  };
};
