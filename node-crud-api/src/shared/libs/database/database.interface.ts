import { Repository } from './repository.interface.js';
import { EntityId } from './types.js';

export interface Database {
  getRepository<T extends EntityId>(entityName: string): Repository<T>;
}
