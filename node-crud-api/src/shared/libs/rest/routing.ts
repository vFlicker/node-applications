import { HttpMethod, HttpStatusCode } from './enums.js';
import { HttpError } from './errors/http.error.js';
import { Router } from './router.js';
import {
  Client,
  Middleware,
  NextFunction,
  Params,
  Route,
  RouteHandler,
} from './types.js';

interface StaticRoute {
  handler: RouteHandler;
  middlewares: Middleware[];
}

type StaticRoutes = Map<string, Map<HttpMethod, StaticRoute>>;

interface DynamicRoute {
  method: HttpMethod;
  regex: RegExp;
  handler: RouteHandler;
  middlewares: Middleware[];
}

interface DynamicRouteMatch {
  handler: RouteHandler;
  params: Params;
  middlewares: Middleware[];
}

export class Routing {
  private staticRoutes: StaticRoutes = new Map();
  private dynamicRoutes: DynamicRoute[] = [];
  private globalMiddlewares: Middleware[] = [];

  public use(middleware: Middleware): void {
    this.globalMiddlewares.push(middleware);
  }

  public registerRouters(routers: Router[]): void {
    for (const router of routers) {
      const routerMiddlewares = router.getMiddlewares();

      for (const route of router.routes) {
        this.addRoute(route, routerMiddlewares);
      }
    }
  }

  private addRoute(route: Route, middlewares: Middleware[]): void {
    const isDynamicPath = this.isDynamicRoute(route.path);
    if (isDynamicPath) {
      this.addDynamicRoute(route, middlewares);
    } else {
      this.addStaticRoute(route, middlewares);
    }
  }

  private isDynamicRoute(path: string): boolean {
    return path.includes('*');
  }

  private addDynamicRoute(route: Route, middlewares: Middleware[]): void {
    const { path, method, handler } = route;
    const regex = new RegExp(`^${path.replace(/\*/g, '(.*)')}$`);
    this.dynamicRoutes.push({ method, regex, handler, middlewares });
  }

  private addStaticRoute(route: Route, middlewares: Middleware[]): void {
    const { path, method, handler } = route;
    if (!this.staticRoutes.has(path)) {
      this.staticRoutes.set(path, new Map());
    }

    const routeMap = this.staticRoutes.get(path)!;
    routeMap.set(method, { handler, middlewares });
  }

  public async processRoute(client: Client): Promise<void> {
    const { url = '/', method } = client.req;
    const httpMethod = this.getHttpMethod(method);
    const pathname = this.getPathname(url);

    let routeHandler: RouteHandler | null = null;
    let routeParams: Params = null;
    let routeMiddlewares: Middleware[] = [];

    // Check static routes first
    const staticMatch = this.findStaticRouteMatch(pathname, httpMethod);
    if (staticMatch) {
      routeHandler = staticMatch.handler;
      routeMiddlewares = staticMatch.middlewares;
    } else {
      // Check dynamic routes if no static match
      const dynamicMatch = this.findDynamicRouteMatch(pathname, httpMethod);
      if (dynamicMatch) {
        routeHandler = dynamicMatch.handler;
        routeParams = dynamicMatch.params;
        routeMiddlewares = dynamicMatch.middlewares;
      }
    }

    if (!routeHandler) {
      throw new HttpError(
        HttpStatusCode.NotFound,
        `Route not found: ${pathname}`,
      );
    }

    // Prepare middleware chain including globals
    const middlewareChain = [...this.globalMiddlewares, ...routeMiddlewares];

    // Execute middleware chain and final handler
    await this.executeMiddlewareChain(client, middlewareChain, async () => {
      await routeHandler!(client, routeParams);
    });
  }

  private async executeMiddlewareChain(
    client: Client,
    middlewares: Middleware[],
    finalHandler: () => Promise<void>,
  ): Promise<void> {
    // Initialize client state object for data sharing between middlewares
    client.state = client.state || {};

    // Create middleware execution chain
    const executeChain = async (index: number): Promise<void> => {
      if (index >= middlewares.length) {
        return finalHandler();
      }

      const next: NextFunction = async () => executeChain(index + 1);
      await middlewares[index](client, next);
    };

    await executeChain(0);
  }

  private getHttpMethod(method?: string): HttpMethod {
    if (!method) return HttpMethod.Get;
    return method.toLowerCase() as HttpMethod;
  }

  private getPathname(url: string): string {
    try {
      const urlObj = new URL(url, 'http://localhost');
      return urlObj.pathname;
    } catch {
      // If URL parsing fails, just return the URL as is
      // This handles relative URLs
      return url;
    }
  }

  private findStaticRouteMatch(
    pathname: string,
    method: HttpMethod,
  ): { handler: RouteHandler; middlewares: Middleware[] } | null {
    const routes = this.staticRoutes.get(pathname);
    if (!routes) return null;

    const route = routes.get(method);
    return route || null;
  }

  private findDynamicRouteMatch(
    pathname: string,
    method: HttpMethod,
  ): DynamicRouteMatch | null {
    for (const route of this.dynamicRoutes) {
      if (route.method !== method) continue;

      const params = pathname.match(route.regex);
      if (params) {
        params.shift(); // Remove the full match
        return {
          handler: route.handler,
          params,
          middlewares: route.middlewares,
        };
      }
    }
    return null;
  }
}
