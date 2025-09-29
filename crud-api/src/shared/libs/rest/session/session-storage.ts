import { InMemoryStorage } from '../storage/storage.js';
import { SerializedSession } from '../types.js';

export const sessionStorage = new InMemoryStorage<SerializedSession>(
  'sessions',
);
