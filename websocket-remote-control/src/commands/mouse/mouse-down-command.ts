import { down, mouse } from '@nut-tree-fork/nut-js';

import { Command } from '#src/types.js';

export const mouseDownCommand: Command = {
  name: 'mouse_down',

  async execute(shiftY: number): Promise<string> {
    await mouse.move(down(shiftY));
    return `${this.name} executed successfully`;
  },
};
