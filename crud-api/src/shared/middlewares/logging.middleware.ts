import { Middleware } from '#src/shared/libs/rest/index.js';

export const loggingMiddleware = (): Middleware => {
  return async (client, _params, next) => {
    const url = client.getUrl();
    const method = client.getMethod();
    const start = Date.now();

    try {
      await next();
    } finally {
      const duration = Date.now() - start;
      const time = new Date().toISOString();
      console.log(`[${time}] ${method} ${url} — completed in ${duration}ms`);
    }
  };
};
