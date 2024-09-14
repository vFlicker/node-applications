import { User } from '#src/shared/types/index.js';

import { Database } from './Database.js';

export class InMemoryDatabase implements Database {
  #users: User[] = [];

  async createUser(userData: User) {
    const id = this.#users.length + 1;
    this.#users.push({ ...userData, id });
    return userData;
  }

  async findAllUsers() {
    return this.#users;
  }

  async findUserById(userId: string): Promise<User | undefined> {
    return this.#users.find((user) => user.id === Number(userId));
  }
}
