- HTTP Server
  4.1. Caching (hight watermark після якого буде видаляти дані, мемоїзація, видаляти після певної кількості)
  4.2. Cookie parser -- парсінг кукі, спочатку була строка, а потім стал колекшен з кукі
  4.3. Buffer piping
  4.4. Logging
  4.5. Routing

- БД
- Data access layer (api для роботи з БД) -- задача щоб код застосунку знав про зберігання як можна менше

+ Config
- add watch files
- Serializer/deserializer -- задача цього шару, щоб всі інші знали менше про перетворення даних
- Domain specific business logic -- абстракції предметної області
- Dependency manipulation

Мені треба допомога в аналізі мого коду і в внесені покращень в нього. Зараз я реалізовую сам REST фреймворк. Спочатку, я мав такий Router.

```ts
import { StatusCodes } from 'http-status-codes';

import { NotFoundError, ValidationError } from './errors';
import { Logger } from './logger';
import { Request, Response } from './types';
import { trimSlash } from './utils';

type Method = string;

type Callback = (req: Request, res: Response) => void;

type Resolver = Record<string, Callback | undefined>;

type Routes = Record<Method, Resolver>;

const HEADERS = { 'Content-Type': 'application/json' };

export class Router {
  private logger = new Logger();

  private routes = {
    POST: {},
    GET: {},
    PUT: {},
    DELETE: {},
  } as Routes;

  post(url: string, callback: Callback): void {
    this.routes.POST[trimSlash(url)] = callback;
  }

  get(url: string, callback: Callback): void {
    this.routes.GET[trimSlash(url)] = callback;
  }

  put(url: string, callback: Callback): void {
    this.routes.PUT[trimSlash(url)] = callback;
  }

  delete(url: string, callback: Callback): void {
    this.routes.DELETE[trimSlash(url)] = callback;
  }

  resolve = async (req: Request, res: Response) => {
    const callback = this.getCallback(req);

    if (!callback) {
      res.writeHead(StatusCodes.NOT_FOUND, HEADERS);
      res.end(JSON.stringify({ message: 'Route not found' }));
      return;
    }

    try {
      await callback(req, res);
    } catch (err) {
      this.logger.error(err);

      if (err instanceof ValidationError) {
        const { code, errors } = err;

        res.writeHead(code, HEADERS);
        res.end(JSON.stringify({ message: errors }));
        return;
      }

      if (err instanceof NotFoundError) {
        const { code, message } = err;

        res.writeHead(code, HEADERS);
        res.end(JSON.stringify({ message }));
        return;
      }

      res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR, HEADERS);
      res.end(JSON.stringify({ message: 'Something went wrong' }));
    }
  };

  private getCallback(req: Request): Callback | null {
    if (!req.method || !req.url) return null;

    const method = req.method;
    const url = trimSlash(req.url);

    // Get all routes for current request method
    const routes = this.routes[method];

    // Start iterating registered routes
    for (const [rawRoute, callback] of Object.entries(routes)) {
      const route = trimSlash(rawRoute);

      // Find all route names from route and save in routeNames
      const routeNames: string[] = [];
      for (const name of route.split('/')) {
        if (name.startsWith(':')) routeNames.push(name.replace(':', ''));
      }

      // Convert route name into regex pattern
      const routeRegex =
        '^' +
        route.replace(/\:\w+(:([^}]+))?/g, () => '([a-zA-Z0-9_.-]*)') +
        '$';

      // Test and match current route against routeRegex
      const valueMatches = url.match(routeRegex);

      if (valueMatches && routeNames && callback) {
        const values = [] as string[];

        for (let index = 1; index < valueMatches.length; index++) {
          values.push(valueMatches[index]);
        }

        const routeParams = routeNames.reduce((accumulator, element, index) => {
          return { ...accumulator, [element]: values[index] };
        }, {});

        req.params = routeParams;
        return callback;
      }
    }

    const callback = routes[url];
    if (!callback) return null;

    return callback;
  }
}
```

Але потім, я вирішив повність перепроектувати (можливо, щось я зробив гірше ніж було). І зараз я маю такі частини:

```ts
// server.ts

import http, { ServerResponse } from 'node:http';

import { Controller } from './controller.js';
import { HttpStatusCode } from './enums.js';
import { HttpError } from './errors/http.error.js';
import { ValidationException } from './errors/validation.exception.js';
import { Router } from './router.js';
import { Routing } from './routing.js';

export class Server {
  private readonly routing = new Routing();
  private server: http.Server | null = null;

  // THINK: чи нормально, що немає конструктору?

  public registerControllers(controllers: Controller[]): void {
    this.server = http.createServer(async (req, res) => {
      const client = { req, res };
      const routers = this.getRouters(controllers);
      this.routing.registerRouters(routers);

      try {
        await this.routing.processRoute(client);
      } catch (error) {
        this.handleHttpResponseError(res, error);
      }
    });
  }

  private getRouters(controllers: Controller[]): Router[] {
    const routers = controllers.map((controller) => controller.router);
    return routers;
  }

  // THINK: здається, що ми не можемо в фреймворку вирішувати як обробляти помилки.
  // ми повинні визначати таку логіку десь в іншому місці
  private handleHttpResponseError(res: ServerResponse, error: unknown): void {
    const defaultHeaders = { 'Content-Type': 'application/json' };

    if (error instanceof ValidationException) {
      const { httpStatusCode, message, errors } = error;
      res.writeHead(httpStatusCode, defaultHeaders);
      res.end(JSON.stringify({ message, errors }));
      return;
    }

    if (error instanceof HttpError) {
      const { httpStatusCode, message } = error;
      res.writeHead(httpStatusCode, defaultHeaders);
      res.end(JSON.stringify({ message }));
      return;
    }

    res.writeHead(HttpStatusCode.InternalServerError, defaultHeaders);
  }

  public listen(port: number): void {
    if (!this.server) {
      throw new Error('Cannot start server without controllers');
    }

    this.server.listen(port);
  }
}

```

```ts
// routing.ts

// THINK: можливо, я переускладнив деякі методи,
// і це можна було б вирішити більш просто, ефективно, елегантно.

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

    // THINK: мені не подобається що я використовую знак оклику, але без "get(path)!"
    // я маю помилку "Object is possibly 'undefined'.ts(2532)"
    this.staticRouteHandlers.get(path)!.set(method, handler);
  }

  public async processRoute(client: Client): Promise<string> {
    // THINK: чи можливо спростити, чи все і так гарно?
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
    // THINK: чи можливо спростити, чи все і так гарно?

    const defaultMethod = HttpMethod.Get;
    if (!method) return defaultMethod;
    return method.toLowerCase() as HttpMethod;
  }

  private findStaticRouteHandler(
    url: string,
    method: HttpMethod,
  ): RouteHandler | null {
    // THINK: чи можливо спростити, чи все і так гарно?
    // мені не дуже подобаються перевірки через .?,
    // але я не знайшов кращого способу написати це
    if (!this.staticRouteHandlers.has(url)) return null;
    return this.staticRouteHandlers.get(url)?.get(method) ?? null;
  }

  private findDynamicRouteMatch(
    url: string,
    method: HttpMethod,
  ): DynamicRouteMatch | null {
    // THINK: чи можливо спростити, чи все і так гарно?

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
```

```ts
// router.ts
import { Route } from './types.js';

export class Router {
  // THINK: чи треба тут Set?
  public routes: Route[] = [];

  public addRoute(route: Route): void {
    this.routes.push(route);
  }
}
```

```ts
// controller.ts

import { HttpStatusCode } from './enums.js';
import { Router } from './router.js';
import { Client, Route } from './types.js';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

export abstract class Controller {
  private readonly _router: Router = new Router();

  get router(): Router {
    return this._router;
  }

  // THINK: чи є сенс використовувати async/await?
  // THINK: чи є сенс винести це в окремий клас, чи цей метод гарний для контролера?
  public async parseBody<T>({ req }: Client): Promise<T> {
    return new Promise((resolve, reject) => {
      // THINK: чи є сенс використовувати масив і робити Buffer.concat?
      let body = '';

      req.on('data', (chunk: ArrayBuffer) => (body += chunk.toString()));

      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });

      req.on('error', reject);
    });
  }

  public addRoute(route: Route): void {
    this._router.addRoute({
      ...route,
      handler: route.handler.bind(this),
    });
  }

  public send<T>(client: Client, statusCode: HttpStatusCode, data: T): void {
    client.res.writeHead(statusCode, DEFAULT_HEADERS);
    client.res.end(JSON.stringify(data));
  }

  public created<T>(client: Client, data: T): void {
    this.send(client, HttpStatusCode.Created, data);
  }

  public ok<T>(client: Client, data: T): void {
    this.send(client, HttpStatusCode.Ok, data);
  }

  public noContent(client: Client): void {
    client.res.writeHead(HttpStatusCode.NoContent);
    client.res.end();
  }

  public badRequest(client: Client, errors: unknown): void {
    this.send(client, HttpStatusCode.BadRequest, errors);
  }

  public notFound(client: Client, errors: unknown): void {
    this.send(client, HttpStatusCode.NotFound, errors);
  }
}
```

Далі я напишу код високорівневого контролеру, щоб ти розумів який API фреймворку і нас вийшов.

```ts
// userController.ts

import { Client, Controller, HttpMethod } from '#src/shared/libs/rest/index.js';

import { UserService } from './user-service.interface.js';

export class UserController extends Controller {
  constructor(private readonly userService: UserService) {
    super();

    this.addRoute({
      path: '/api/users',
      method: HttpMethod.Get,
      handler: this.getAll,
    });
  }

  public async getAll(client: Client): Promise<void> {
    const foundUsers = await this.userService.findAll();
    this.ok(client, foundUsers);
  }
}
```

Ти можеш змінювати код, навіть кардинально, мета одна -- простий і зрозумілий API фреймворк (високорівневий код), простий і зрозумілий низькорівневий код, а також, можливість розширення функціоналу. Наприклад, у майбутньому можливо я додам роботу з Cookies та кешування, а також міделвари.


