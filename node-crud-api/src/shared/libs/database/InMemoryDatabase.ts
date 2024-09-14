import { User } from '#src/shared/types/index.js';

import { Database } from './Database.js';

export class InMemoryDatabase implements Database {
  users: User[] = [];
}
