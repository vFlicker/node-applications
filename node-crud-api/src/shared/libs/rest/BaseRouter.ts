import { Route, Router } from './types.js';

export class BaseRouter implements Router {
  public routes: Route[] = [];

  public addRoute(route: Route): void {
    this.routes.push(route);
  }
}
