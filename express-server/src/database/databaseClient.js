export const createDatabaseClient = () => ({
  execute(action, payload = null) {
    process.send({ action, payload });

    return new Promise((resolve) => {
      process.once('message', (message) => {
        resolve(message);
      });
    });
  },
});
