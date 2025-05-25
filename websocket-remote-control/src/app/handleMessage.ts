import { commandApi } from '#src/commands/command-api.js';
import { Action } from '#src/types.js';

export const handleMessage = async (action: Action): Promise<string> => {
  const { commandName, payload } = action;
  const command = commandApi[commandName];

  if (!command) throw new Error(`Unknown action: ${commandName}`);

  try {
    const result = await command.execute(...payload);
    return result || commandName;
  } catch (err) {
    console.error(`Error executing command: ${commandName}`, err);
    throw new Error(`Command ${commandName} failed with error`);
  }
};
