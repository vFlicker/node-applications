import { Route } from './types.js';

export class Router {
  // THINK: чи треба тут Set?
  public routes: Route[] = [];

  public addRoute(route: Route): void {
    this.routes.push(route);
  }
}
