import {
  BaseController,
  Client,
  HttpMethod,
  Params,
} from '#src/shared/libs/rest/index.js';
import { validate } from '#src/shared/libs/validator/index.js';

import { createNewUserSchema } from './schemas/create-new-user.schema.js';
import { userIdSchema } from './schemas/user-id.schema.js';
import { UserDto } from './user.dto.js';
import { UserService } from './user-service.interface.js';

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
    const userDto = await this.parseBody<UserDto>(client);
    const errors = validate(userDto, createNewUserSchema);
    if (errors.length > 0) {
      this.badRequest(client, errors);
      return;
    }
    const createdUser = await this.userService.createUser(userDto);
    this.created(client, createdUser);
  }

  public async getAllUser(client: Client): Promise<void> {
    const foundUsers = await this.userService.findAllUsers();
    this.ok(client, foundUsers);
  }

  public async getUserById(client: Client, params: Params): Promise<void> {
    const userId = params && Number(params[0]);
    const errors = validate({ id: userId }, userIdSchema);
    if (errors.length > 0) {
      this.badRequest(client, { message: 'Invalid id' });
      return;
    }

    const foundUser = await this.userService.findUserById(userId!);
    if (!foundUser) {
      this.notFound(client, { message: 'User not found' });
      return;
    }
    this.ok(client, foundUser);
  }

  public async updateUser(client: Client, params: Params): Promise<void> {
    const userId = params && Number(params[0]);
    const errors = validate({ id: userId }, userIdSchema);
    if (errors.length > 0) {
      this.badRequest(client, { message: 'Invalid id' });
      return;
    }

    const foundUser = await this.userService.findUserById(userId!);
    if (!foundUser) {
      this.notFound(client, { message: 'User not found' });
      return;
    }

    const userDto = await this.parseBody<UserDto>(client);
    const updatedUser = await this.userService.updateUser(userId!, userDto);
    this.ok(client, updatedUser);
  }

  public async deleteUser(client: Client, params: Params): Promise<void> {
    const userId = params && Number(params[0]);
    const errors = validate({ id: userId }, userIdSchema);
    if (errors.length > 0) {
      this.badRequest(client, { message: 'Invalid id' });
      return;
    }

    const foundUser = await this.userService.findUserById(userId!);
    if (!foundUser) {
      this.notFound(client, { message: 'User not found' });
      return;
    }

    await this.userService.deleteUser(userId!);
    this.noContent(client);
  }
}
