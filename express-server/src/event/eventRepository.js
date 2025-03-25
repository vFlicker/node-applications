import { v4 as generateId } from 'uuid';

import { database } from '../database.js';

const add = async (event) => {
  const createdEvent = { id: generateId(), ...event };
  database.push(createdEvent);
  return createdEvent;
};

const findAll = async () => {
  return database;
};

const findById = async (id) => {
  const foundEvent = database.find((event) => event.id === id);
  if (!foundEvent) return null;
  return foundEvent;
};

export const eventRepository = {
  findAll,
  findById,
  add,
};
