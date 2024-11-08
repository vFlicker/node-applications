export class EntityNotFoundError extends Error {
  constructor(id: number) {
    super(`Entity with id ${id} not found.`);
    this.name = 'EntityNotFoundError';
  }
}
