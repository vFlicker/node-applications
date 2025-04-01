import { v4 as generateId } from 'uuid';

class Database {
  #data = [];

  constructor() {
    this.#data = [];
  }

  create(payload) {
    const createdRecord = { id: generateId(), ...payload };
    this.#data.push(createdRecord);
    return createdRecord;
  }

  findAll() {
    return [...this.#data];
  }

  findById(id) {
    const foundRecord = this.#data.find((event) => event.id === id);
    return foundRecord || null;
  }
}

const database = new Database();

process.on('message', ({ action, payload, requestId }) => {
  try {
    const result = database[action](payload);
    process.send({ requestId, data: result });
  } catch (error) {
    process.send({ requestId, error: error.message });
  }
});
