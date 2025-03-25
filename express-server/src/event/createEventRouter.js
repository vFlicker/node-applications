import { Router } from 'express';
import asyncHandler from 'express-async-handler';

export const createEventRouter = (eventController) => {
  const router = Router();

  router.get('/', asyncHandler(eventController.getAll));
  router.get('/:id', asyncHandler(eventController.getById));
  router.post('/', asyncHandler(eventController.create));

  return router;
};
