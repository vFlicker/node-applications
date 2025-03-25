export const isValidText = (value) => {
  return value && value.trim().length > 0;
};

export const isValidDate = (value) => {
  const date = new Date(value);
  return value && date !== 'Invalid Date';
};

export const isValidImageUrl = (value) => {
  return value && value.startsWith('http');
};
