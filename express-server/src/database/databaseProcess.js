import { v4 as generateId } from 'uuid';

const database = [];

process.on('message', ({ action, payload }) => {
  if (action === 'add') {
    const created = { id: generateId(), ...payload };
    database.push(created);
    process.send({ ...created });
  }

  if (action === 'findAll') {
    process.send({ ...database });
  }

  if (action === 'findById') {
    const foundEvent = database.find((event) => event.id === payload);
    process.send({ ...foundEvent });
  }
});
