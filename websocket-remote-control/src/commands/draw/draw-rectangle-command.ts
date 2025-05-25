import { Button, down, left, mouse, right, up } from '@nut-tree-fork/nut-js';

import { Command } from '#src/types.js';

export const drawRectangleCommand: Command = {
  name: 'draw_rectangle',

  async execute(width: number, height: number): Promise<string> {
    await mouse.pressButton(Button.LEFT);
    await mouse.move(right(width));
    await mouse.move(down(height));
    await mouse.move(left(width));
    await mouse.move(up(height));
    await mouse.releaseButton(Button.LEFT);

    return `${this.name} executed successfully`;
  },
};
