import { StatusCode } from '../constants.js';
import { createEventValidator } from './validators/createEventValidator.js';

export const createEventController = (eventRepository) => ({
  async create(req, res) {
    const event = req.body;

    const errors = createEventValidator(event);
    if (Object.keys(errors).length > 0) {
      const message = 'Adding the event failed due to validation errors.';
      res.status(StatusCode.UNPROCESSABLE_ENTITY).json({ message, errors });
      return;
    }

    const createdEvent = await eventRepository.add(event);
    res
      .status(StatusCode.CREATED)
      .json({ message: 'Event saved.', event: createdEvent });
  },

  async getAll(_req, res) {
    const foundEvents = await eventRepository.findAll();
    res.json(foundEvents);
  },

  async getById(req, res) {
    const foundEvent = await eventRepository.findById(req.params.id);
    res.status(StatusCode.OK).json(foundEvent);
  },
});
