export const createEventRepository = (databaseClient) => ({
  async add(event) {
    const createdEvent = await databaseClient.create({ event });
    return createdEvent;
  },

  async findAll() {
    const events = await databaseClient.findAll();
    return events;
  },

  async findById(id) {
    const event = await databaseClient.findById({ id });
    return event;
  },
});
