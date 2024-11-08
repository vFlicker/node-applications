import { Database } from '#src/shared/libs/database/index.js';
import { Repository } from '#src/shared/libs/database/index.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './user.type.js';

export class DefaultUserService {
  private userRepository: Repository<User>;

  constructor(database: Database) {
    this.userRepository = database.getRepository<User>('users');
  }

  public async createUser(dto: CreateUserDto): Promise<User> {
    const createdUser = await this.userRepository.add(dto);
    return createdUser;
  }

  public async findAllUsers() {
    const users = await this.userRepository.findAll();
    return users;
  }

  public async findUserById(userId: number): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    return user;
  }

  public async updateUserById(userId: number, dto: UpdateUserDto) {
    const updatedUser = await this.userRepository.update(userId, dto);
    return updatedUser;
  }

  public async deleteUserById(userId: number) {
    await this.userRepository.delete(userId);
  }
}
