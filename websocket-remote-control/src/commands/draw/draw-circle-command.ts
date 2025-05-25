import { Button, mouse, Point, right } from '@nut-tree-fork/nut-js';

import { Command } from '#src/types.js';

export const drawCircleCommand: Command = {
  name: 'draw_circle',

  async execute(radius: number): Promise<string> {
    const center = await mouse.getPosition();
    const points = [];

    for (let angle = 0; angle <= 2 * Math.PI; angle += 0.01) {
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);
      points.push(new Point(x, y));
    }

    await mouse.move(right(radius));
    await mouse.pressButton(Button.LEFT);
    await mouse.move(points);
    await mouse.releaseButton(Button.LEFT);

    return `${this.name} executed successfully`;
  },
};
