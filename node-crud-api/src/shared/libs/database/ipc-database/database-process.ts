// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { InMemoryDatabase } from '../in-memory-database/in-memory-database.js';

export function startDatabaseProcess() {
  const database = new InMemoryDatabase();

  process.on('message', async (message) => {
    const { action, entityName, data, id, messageId, from } = message;

    let result;

    try {
      const repository = database.getRepository(entityName);

      switch (action) {
        case 'add':
          result = await repository.add(data);
          break;
        case 'findAll':
          result = await repository.findAll();
          break;
        case 'findById':
          result = await repository.findById(data);
          break;
        case 'update':
          result = await repository.update(data.id, data.updatedData);
          break;
        case 'delete':
          await repository.delete(data);
          result = null;
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      process.send({
        result,
        to: from,
        messageId,
      });
    } catch (error) {
      process.send({
        error: error.message,
        to: from,
        messageId,
      });
    }
  });
}
