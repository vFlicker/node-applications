import { Action } from '#src/types.js';

export const parseMessage = (data: string): Action => {
  const [commandName, ...coords] = data.split(' ');

  return {
    commandName,
    payload: coords.map(Number),
  };
};
