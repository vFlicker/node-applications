import { Database } from '#src/shared/libs/database/index.js';
import { User } from '#src/shared/types/index.js';

export class DefaultUserService {
  constructor(private readonly database: Database) {
    this.database = database;
  }

  public async createUser(userData: User) {
    const id = this.database.users.length + 1;
    this.database.users.push({ ...userData, id });
    const createdUser = this.database.users.find((user) => user.id === id);
    return createdUser;
  }

  public async findAllUsers() {
    return this.database.users;
  }

  public async findUserById(userId: string): Promise<User | undefined> {
    return this.database.users.find((user) => user.id === Number(userId));
  }

  public async updateUser(userId: string, userData: User) {
    const userIndex = this.database.users.findIndex(
      (user) => user.id === Number(userId),
    );
    this.database.users[userIndex] = { ...userData, id: Number(userId) };
    return this.database.users[userIndex];
  }

  public async deleteUser(userId: string) {
    const userIndex = this.database.users.findIndex(
      (user) => user.id === Number(userId),
    );
    this.database.users.splice(userIndex, 1);
  }
}
