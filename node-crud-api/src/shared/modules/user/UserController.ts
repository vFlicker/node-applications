import { Database } from '#src/shared/libs/database/index.js';
import {
  BaseController,
  Client,
  HttpMethod,
  Params,
} from '#src/shared/libs/rest/index.js';
import { User } from '#src/shared/types/index.js';

import { UserDto } from './UserDto.js';

export class UserController extends BaseController {
  #database: Database;

  constructor(database: Database) {
    super();

    this.#database = database;

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
  }

  public async createUser(client: Client): Promise<User | undefined> {
    try {
      const userDto = await this.parseBody<UserDto>(client);
      const createdUser = await this.#database.createUser(userDto);
      return createdUser as User;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  public async getAllUser(): Promise<User[]> {
    const foundUsers = this.#database.findAllUsers();
    return foundUsers;
  }

  public async getUserById(
    _client: Client,
    params: Params,
  ): Promise<User | undefined> {
    if (!params) throw new Error('No params found');

    const userId = params[0];
    const foundUser = await this.#database.findUserById(userId);
    return foundUser;
  }
}
