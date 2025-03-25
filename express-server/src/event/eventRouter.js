import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { eventController } from './eventController.js';

export const eventRouter = Router();

eventRouter.get('/', asyncHandler(eventController.getAll));
eventRouter.get('/:id', asyncHandler(eventController.getById));
eventRouter.post('/', asyncHandler(eventController.create));
