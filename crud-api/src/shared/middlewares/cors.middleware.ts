import { Middleware } from '#src/shared/libs/rest/index.js';

export const corsMiddleware = (allowedOrigins: string[]): Middleware => {
  return async (client, _params, next) => {
    const origin = client.getRequestHeader('Origin');

    if (origin && allowedOrigins.includes(origin)) {
      client.setResponseHeaders({ 'Access-Control-Allow-Origin': origin });
      client.setResponseHeader('Access-Control-Allow-Credentials', 'true');
    } else if (allowedOrigins.includes('*')) {
      client.setResponseHeader('Access-Control-Allow-Origin', '*');
    }

    client.setResponseHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
    client.setResponseHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );

    if (client.req.method === 'OPTIONS') {
      client.setStatusCode(204);
      client.res.end();
      return;
    }

    return next();
  };
};
