import { Button, down, left, mouse, right, up } from '@nut-tree-fork/nut-js';

import { Command } from '#src/types.js';

export const drawSquareCommand: Command = {
  name: 'draw_square',

  async execute(size: number): Promise<string> {
    await mouse.pressButton(Button.LEFT);
    await mouse.move(right(size));
    await mouse.move(down(size));
    await mouse.move(left(size));
    await mouse.move(up(size));
    await mouse.releaseButton(Button.LEFT);

    return `${this.name} executed successfully`;
  },
};
