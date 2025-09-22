import {
  Client,
  Middleware,
  UnauthorizedAccessException,
} from '#src/shared/libs/rest/index.js';

export class AuthMiddleware implements Middleware {
  public execute(client: Client, next: () => Promise<void>): Promise<void> {
    const token = client.getRequestHeader('Authorization');

    if (!token) {
      return Promise.reject(
        new UnauthorizedAccessException('No token provided'),
      );
    }

    return next();
  }
}
