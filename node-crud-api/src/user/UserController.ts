import { wait } from '#src/shared/helpers/index.js';
import {
  BaseController,
  Client,
  HttpMethod,
  Params,
} from '#src/shared/libs/rest/index.js';

export class UserController extends BaseController {
  constructor() {
    super();

    this.addRoute({
      path: '/user',
      method: HttpMethod.Get,
      handler: this.getUser,
    });
    this.addRoute({
      path: '/user/*',
      method: HttpMethod.Get,
      handler: this.getUserById,
    });
    this.addRoute({
      path: '/user',
      method: HttpMethod.Post,
      handler: this.createUser,
    });
  }

  public async getUser({ res }: Client): Promise<{ status: number }> {
    await wait(2000);
    return { status: res.statusCode };
  }

  public async getUserById(_client: Client, params: Params): Promise<string> {
    if (!params) return 'parameter=[]';
    return 'parameter=' + params;
  }

  public async createUser(): Promise<string> {
    return 'Created';
  }
}
