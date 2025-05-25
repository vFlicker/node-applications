type CommandName = string;
type Payload = number[];

export type Action = {
  commandName: CommandName;
  payload: Payload;
};

export interface Command {
  name: CommandName;
  execute: (...payload: Payload) => Promise<string>;
}

export type CommandApi = Record<CommandName, Command>;
