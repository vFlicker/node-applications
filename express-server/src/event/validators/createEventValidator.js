import {
  isValidDate,
  isValidImageUrl,
  isValidText,
} from '../../helpers/index.js';

export const createEventValidator = (data) => {
  const errors = {};

  if (!isValidText(data.title)) {
    errors.title = 'Invalid title.';
  }

  if (!isValidText(data.description)) {
    errors.description = 'Invalid description.';
  }

  if (!isValidDate(data.date)) {
    errors.date = 'Invalid date.';
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = 'Invalid image.';
  }

  return errors;
};
