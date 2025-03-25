export const createEventHSRepository = () => ({
  async add(event) {
    process.send({ action: 'add', payload: event });

    return new Promise((resolve) => {
      process.on('message', (message) => {
        if (message.id === event.id) {
          resolve(message);
        }
      });
    });
  },

  async findAll() {
    process.send({ action: 'findAll' });

    return new Promise((resolve) => {
      process.on('message', (message) => {
        resolve(message);
      });
    });
  },

  async findById(id) {
    process.send({ action: 'findById', payload: id });

    return new Promise((resolve) => {
      process.on('message', (message) => {
        resolve(message);
      });
    });
  },
});
