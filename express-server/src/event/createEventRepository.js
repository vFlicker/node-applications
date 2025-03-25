import { v4 as generateId } from 'uuid';

export const createEventRepository = (database) => ({
  async add(event) {
    const createdEvent = { id: generateId(), ...event };
    database.push(createdEvent);
    return createdEvent;
  },

  async findAll() {
    return database;
  },

  async findById(id) {
    const foundEvent = database.find((event) => event.id === id);
    if (!foundEvent) return null;
    return foundEvent;
  },
});
