import { BaseRouter } from './BaseRouter.js';
import { Controller, Route, Router } from './types.js';

export abstract class BaseController implements Controller {
  private readonly _router: Router;

  constructor() {
    this._router = new BaseRouter();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: Route) {
    this._router.addRoute(route);
  }
}
