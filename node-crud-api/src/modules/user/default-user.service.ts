import { DatabaseClient, Repository } from '#src/shared/libs/database/index.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './user.type.js';

export class DefaultUserService {
  private userRepository: Repository<User>;

  constructor(database: DatabaseClient) {
    this.userRepository = database.getRepository<User>('users');
  }

  public async create(dto: CreateUserDto): Promise<User> {
    return this.userRepository.create(dto);
  }

  public async findAll() {
    return this.userRepository.findAll();
  }

  public async findById(userId: number): Promise<User | null> {
    return this.userRepository.findById({ id: userId });
  }

  public async updateById(userId: number, dto: UpdateUserDto) {
    return this.userRepository.update({ id: userId }, dto);
  }

  public async deleteById(userId: number) {
    return this.userRepository.delete({ id: userId });
  }
}
