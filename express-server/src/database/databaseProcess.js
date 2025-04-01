class EntityNotFoundError extends Error {
  constructor(id) {
    super(`Entity with id ${id} not found.`);
    this.name = 'EntityNotFoundError';
  }
}

class InMemoryRepository {
  data = [];
  idCounter = 0;

  async create(entity) {
    const id = (this.idCounter += 1);
    const newEntity = { ...entity, id };
    this.data.push(newEntity);
    return newEntity;
  }

  async findAll() {
    return [...this.data];
  }

  async findById(id) {
    return this.data.find((item) => item.id === id) || null;
  }

  async delete(id) {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) this.data.splice(index, 1);
    else throw new EntityNotFoundError(id);
  }

  async update(id, updatedData) {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      const updatedEntity = { ...this.data[index], ...updatedData };
      this.data[index] = updatedEntity;
      return updatedEntity;
    } else {
      throw new EntityNotFoundError(id);
    }
  }
}

class Database {
  #repositories = new Map();

  constructor() {
    this.#repositories = new Map();
  }

  getRepository(entityName) {
    if (!this.#repositories.has(entityName)) {
      this.#repositories.set(entityName, new InMemoryRepository());
    }
    return this.#repositories.get(entityName);
  }

  handleRequest({ action, entityName, ...payload }) {
    const repository = this.getRepository(entityName);
    if (!repository || typeof repository[action] !== 'function') {
      throw new Error(`Unknown action: ${action} for entity: ${entityName}`);
    }
    return repository[action](...Object.values(payload));
  }
}

const database = new Database();

process.on('message', async ({ action, entityName, payload, requestId }) => {
  try {
    const result = await database.handleRequest({
      action,
      entityName,
      ...payload,
    });
    process.send({ requestId, data: result });
  } catch (error) {
    process.send({ requestId, error: error.message });
  }
});
