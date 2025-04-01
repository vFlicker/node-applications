export const createEventRepository = (databaseClient) => {
  const userRepository = databaseClient.getRepository('users');

  return {
    async add(event) {
      const createdEvent = await userRepository.create({ event });
      return createdEvent;
    },

    async findAll() {
      const events = await userRepository.findAll();
      return events;
    },

    async findById(id) {
      const event = await userRepository.findById({ id });
      return event;
    },
  };
};
