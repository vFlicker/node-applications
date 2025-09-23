import { Client, Middleware, Params } from './types.js';

export const executeMiddlewareChain = async (
  middlewares: Middleware[],
  client: Client,
  finalHandler: () => Promise<void>,
  params: Params = null,
): Promise<void> => {
  const executeNext = async (index: number): Promise<void> => {
    if (index < middlewares.length) {
      const currentMiddleware = middlewares[index];
      await currentMiddleware(client, params, () => executeNext(index + 1));
    } else {
      await finalHandler();
    }
  };

  await executeNext(0);
};
