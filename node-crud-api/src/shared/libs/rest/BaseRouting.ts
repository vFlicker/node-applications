import { HttpMethod } from './enums.js';
import {
  Client,
  Params,
  Route,
  RouteHandler,
  Router,
  Routing,
} from './types.js';

type StaticRoutes = Map<string, Map<HttpMethod, RouteHandler>>;

type DynamicRoute = {
  method: HttpMethod;
  regex: RegExp;
  handler: RouteHandler;
};

type DynamicRouteMatch = {
  handler: RouteHandler;
  params: Params;
};

export class BaseRouting implements Routing {
  private staticRouteHandlers: StaticRoutes = new Map();
  private dynamicRouteHandlers: DynamicRoute[] = [];

  public registerRouters(routers: Router[]): void {
    for (const router of routers) {
      for (const route of router.routes) {
        this.addRoute(route);
      }
    }
  }

  private addRoute(route: Route): void {
    if (this.isDynamicRoute(route.path)) this.addDynamicRoute(route);
    else this.addStaticRoute(route);
  }

  private isDynamicRoute(path: string): boolean {
    return path.includes('*');
  }

  private addDynamicRoute(route: Route): void {
    const { path, method, handler } = route;
    const regex = new RegExp(path.replaceAll('*', '(.*)'));
    this.dynamicRouteHandlers.push({ method, regex, handler });
  }

  private addStaticRoute(route: Route): void {
    const { path, method, handler } = route;
    const hasPath = this.staticRouteHandlers.has(path);
    if (!hasPath) this.staticRouteHandlers.set(path, new Map());
    this.staticRouteHandlers.get(path)!.set(method, handler);
  }

  public async processRoute(client: Client): Promise<string> {
    const { url = '', method } = client.req;
    const httpMethod = this.getHttpMethod(method);

    const staticHandler = this.findStaticRouteHandler(url, httpMethod);
    if (staticHandler) return this.executeHandler(client, staticHandler, null);

    const dynamicMatch = this.findDynamicRouteMatch(url, httpMethod);
    if (dynamicMatch) {
      const { handler: dynamicHandler, params } = dynamicMatch;
      return this.executeHandler(client, dynamicHandler, params);
    }

    return this.handleNotFound(client);
  }

  private getHttpMethod(method?: string): HttpMethod {
    return (method?.toLowerCase() as HttpMethod) || HttpMethod.Get;
  }

  private findStaticRouteHandler(
    url: string,
    method: HttpMethod,
  ): RouteHandler | undefined {
    return this.staticRouteHandlers.get(url)?.get(method);
  }

  private findDynamicRouteMatch(
    url: string,
    method: HttpMethod,
  ): DynamicRouteMatch | undefined {
    for (const dynamicRoute of this.dynamicRouteHandlers) {
      const { method: routeMethod, regex, handler } = dynamicRoute;
      const params = url.match(regex);
      if (params && routeMethod === method) {
        params.shift();
        return { handler, params };
      }
    }

    return undefined;
  }

  private async executeHandler(
    client: Client,
    handler: RouteHandler,
    params: Params,
  ): Promise<string> {
    const result = await handler(client, params);
    return JSON.stringify(result);
  }

  private handleNotFound(client: Client): string {
    client.res.statusCode = 404;
    return 'Route not found';
  }
}
