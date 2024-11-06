import { User } from '#src/shared/types/index.js';

import { Database } from './database.interface.js';

export class InMemoryDatabase implements Database {
  users: User[] = [];
}
