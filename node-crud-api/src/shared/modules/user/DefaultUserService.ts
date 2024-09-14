import { Database } from '#src/shared/libs/database/index.js';
import { User } from '#src/shared/types/index.js';

export class DefaultUserService {
  constructor(private readonly database: Database) {
    this.database = database;
  }

  public async createUser(userData: User) {
    const id = this.database.users.length + 1;
    this.database.users.push({ ...userData, id });
    return userData;
  }

  public async findAllUsers() {
    return this.database.users;
  }

  public async findUserById(userId: string): Promise<User | undefined> {
    return this.database.users.find((user) => user.id === Number(userId));
  }
}
