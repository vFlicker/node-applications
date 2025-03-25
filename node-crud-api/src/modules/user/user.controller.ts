import {
  BadRequestException,
  Client,
  Controller,
  NotFoundException,
  Params,
  ValidationException,
} from '#src/shared/libs/rest/index.js';
import { validate } from '#src/shared/libs/validator/index.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { createNewUserSchema } from './schemas/create-new-user.schema.js';
import { userIdSchema } from './schemas/user-id.schema.js';
import { UserService } from './user-service.interface.js';

export class UserController extends Controller {
  constructor(private readonly userService: UserService) {
    super();

    this.post('/api/users', this.create);
    this.get('/api/users', this.getAll);
    this.get('/api/users/*', this.getById);
    this.put('/api/users/*', this.updateById);
    this.delete('/api/users/*', this.deleteById);
  }

  public async create(client: Client): Promise<void> {
    const userDto = await this.parseBody<CreateUserDto>(client);

    const errors = validate(userDto, createNewUserSchema);
    if (errors.length > 0) throw new ValidationException(errors);

    const createdUser = await this.userService.create(userDto);
    this.created(client, createdUser);
  }

  public async getAll(client: Client): Promise<void> {
    const foundUsers = await this.userService.findAll();
    this.ok(client, foundUsers);
  }

  public async getById(client: Client, params: Params): Promise<void> {
    const userId = params && Number(params[0]);

    const errors = validate({ id: userId }, userIdSchema);
    if (errors.length > 0) throw new BadRequestException('Invalid id');

    const foundUser = await this.userService.findById(userId!);
    if (!foundUser) throw new NotFoundException('User not found');

    this.ok(client, foundUser);
  }

  public async updateById(client: Client, params: Params): Promise<void> {
    const userId = params && Number(params[0]);

    const errors = validate({ id: userId }, userIdSchema);
    if (errors.length > 0) throw new BadRequestException('Invalid id');

    const foundUser = await this.userService.findById(userId!);
    if (!foundUser) throw new NotFoundException('User not found');

    const userDto = await this.parseBody<UpdateUserDto>(client);
    const updatedUser = await this.userService.updateById(userId!, userDto);
    this.ok(client, updatedUser);
  }

  public async deleteById(client: Client, params: Params): Promise<void> {
    const userId = params && Number(params[0]);

    const errors = validate({ id: userId }, userIdSchema);
    if (errors.length > 0) throw new BadRequestException('Invalid id');

    const foundUser = await this.userService.findById(userId!);
    if (!foundUser) throw new NotFoundException('User not found');

    await this.userService.deleteById(userId!);
    this.noContent(client);
  }
}
