export const createEventRepository = (databaseClient) => ({
  async add(event) {
    return databaseClient.execute('add', { event });
  },

  async findAll() {
    return databaseClient.execute('findAll');
  },

  async findById(id) {
    return databaseClient.execute('findById', { id });
  },
});
