import {
  BaseController,
  Client,
  HttpMethod,
  Params,
} from '#src/shared/libs/rest/index.js';

import { UserDto } from './UserDto.js';
import { UserService } from './UserService.js';

export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();

    this.addRoute({
      path: '/api/users',
      method: HttpMethod.Post,
      handler: this.createUser.bind(this),
    });

    this.addRoute({
      path: '/api/users',
      method: HttpMethod.Get,
      handler: this.getAllUser.bind(this),
    });

    this.addRoute({
      path: 'api/users/*',
      method: HttpMethod.Get,
      handler: this.getUserById.bind(this),
    });

    this.addRoute({
      path: 'api/users/*',
      method: HttpMethod.Put,
      handler: this.updateUser.bind(this),
    });

    this.addRoute({
      path: 'api/users/*',
      method: HttpMethod.Delete,
      handler: this.deleteUser.bind(this),
    });
  }

  public async createUser(client: Client): Promise<void> {
    try {
      const userDto = await this.parseBody<UserDto>(client);
      const createdUser = await this.userService.createUser(userDto);
      this.created(client, createdUser);
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  public async getAllUser(client: Client): Promise<void> {
    const foundUsers = await this.userService.findAllUsers();
    this.ok(client, foundUsers);
  }

  public async getUserById(client: Client, params: Params): Promise<void> {
    if (!params) throw new Error('No params found');

    const userId = params[0];
    const foundUser = await this.userService.findUserById(userId);
    this.ok(client, foundUser);
  }

  public async updateUser(client: Client, params: Params): Promise<void> {
    if (!params) throw new Error('No params found');

    const userId = params[0];
    const userDto = await this.parseBody<UserDto>(client);
    const updatedUser = await this.userService.updateUser(userId, userDto);
    this.ok(client, updatedUser);
  }

  public async deleteUser(client: Client, params: Params): Promise<void> {
    if (!params) throw new Error('No params found');

    const userId = params[0];
    await this.userService.deleteUser(userId);
    this.noContent(client);
  }
}
