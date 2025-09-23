import { HttpMethod } from './enums.js';
import { NotFoundException } from './errors/not-found.exception.js';
import { executeMiddlewareChain } from './execute-middleware-chain.js';
import { Router } from './router.js';
import { Client, Params, Route } from './types.js';

export class Routing {
  // We can use Trie data structure to optimize the routing process,
  // but for simplicity, we will use a linear search to find the matching route.
  private routes: Route[] = [];

  public registerRouters(routers: Router[]): void {
    for (const router of routers) {
      for (const route of router.routes) {
        this.routes.push(this.prepareRoute(route));
      }
    }
  }

  private prepareRoute(route: Route): Route {
    const { path } = route;
    const isDynamic = path.includes('*');

    if (isDynamic) {
      // Create a pattern that captures segments marked with *
      const pattern = new RegExp(`^${path.replace(/\*/g, '([^/]*)')}$`);
      return { ...route, pattern };
    }

    return { ...route, pattern: null };
  }

  public async processRoute(client: Client): Promise<string | void> {
    const url = client.getUrl();
    const method = client.getMethod();
    const httpMethod = this.getHttpMethod(method);

    const route = this.findMatchingRoute(url, httpMethod);
    if (!route) throw new NotFoundException(`Route not found: ${url}`);

    const { handler, pattern, middlewares = [] } = route;
    const params = pattern ? this.extractParams(url, pattern) : null;

    await executeMiddlewareChain(
      middlewares,
      client,
      async () => {
        await handler(client, params);
      },
      params,
    );
  }

  private getHttpMethod(method?: string): HttpMethod {
    if (!method) return HttpMethod.Get;
    return method.toLowerCase() as HttpMethod;
  }

  private findMatchingRoute(
    url: string,
    httpMethod: HttpMethod,
  ): Route | undefined {
    const staticRoute = this.routes.find(({ method, path, pattern }) => {
      return !pattern && path === url && method === httpMethod;
    });

    if (staticRoute) return staticRoute;

    return this.routes.find(({ method, pattern }) => {
      if (!pattern || method !== httpMethod) return false;
      return pattern.test(url);
    });
  }

  private extractParams(url: string, pattern: RegExp): Params {
    const match = url.match(pattern);
    if (!match) return null;

    match.shift();
    return match;
  }
}
