import { Collection, DatabaseClient } from '#src/shared/libs/database/index.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './user.type.js';

export class DefaultUserService {
  private userCollection: Collection<User>;

  constructor(database: DatabaseClient) {
    this.userCollection = database.getCollection<User>('users');
  }

  public async create(dto: CreateUserDto): Promise<User> {
    return this.userCollection.create(dto);
  }

  public async findAll() {
    return this.userCollection.findAll();
  }

  public async findById(userId: string): Promise<User | null> {
    return this.userCollection.findById({ id: userId });
  }

  public async updateById(userId: string, dto: UpdateUserDto) {
    return this.userCollection.update({ id: userId }, dto);
  }

  public async deleteById(userId: string) {
    return this.userCollection.delete({ id: userId });
  }
}
