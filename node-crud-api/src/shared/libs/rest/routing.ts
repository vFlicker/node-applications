import { HttpMethod, HttpStatusCode } from './enums.js';
import { HttpError } from './errors/http.error.js';
import { Router } from './router.js';
import { Client, Params, Route, RouteHandler } from './types.js';

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

// THINK: ніби хочеться щоб StaticRoutes і DynamicRoute мали однаковий інтерфейс,
// але здається, в цьому немає сенсу

export class Routing {
  // THINK: чи є сенс використовувати однакові структури
  // даних Map для статичних і динамічних роутів?
  private staticRouteHandlers: StaticRoutes = new Map();
  private dynamicRouteHandlers: DynamicRoute[] = [];

  public registerRouters(routers: Router[]): void {
    // THINK: чи є можливість позбавитись O(n^2)?
    for (const router of routers) {
      for (const route of router.routes) {
        this.addRoute(route);
      }
    }
  }

  private addRoute(route: Route): void {
    const isDynamicPath = this.isDynamicRoute(route.path);
    if (isDynamicPath) this.addDynamicRoute(route);
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

    // THINK: без "get(path)!"
    // я маю помилку "Object is possibly 'undefined'.ts(2532)"
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

    throw new HttpError(HttpStatusCode.NotFound, `Route not found: ${url}`);
  }

  private getHttpMethod(method?: string): HttpMethod {
    const defaultMethod = HttpMethod.Get;
    if (!method) return defaultMethod;
    return method.toLowerCase() as HttpMethod;
  }

  private findStaticRouteHandler(
    url: string,
    method: HttpMethod,
  ): RouteHandler | null {
    if (!this.staticRouteHandlers.has(url)) return null;
    return this.staticRouteHandlers.get(url)?.get(method) ?? null;
  }

  private findDynamicRouteMatch(
    url: string,
    method: HttpMethod,
  ): DynamicRouteMatch | null {
    for (const dynamicRoute of this.dynamicRouteHandlers) {
      const { method: routeMethod, regex, handler } = dynamicRoute;
      const params = url.match(regex);
      if (params && routeMethod === method) {
        params.shift();
        return { handler, params };
      }
    }

    return null;
  }

  private async executeHandler(
    client: Client,
    handler: RouteHandler,
    params: Params,
  ): Promise<string> {
    // THINK: здається, що я взагалі нічого не повертаю з handler.
    // Треба подивитися на метод контролеру
    const result = await handler(client, params);
    return JSON.stringify(result);
  }
}
