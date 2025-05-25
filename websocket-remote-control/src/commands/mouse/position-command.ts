import { mouse } from '@nut-tree-fork/nut-js';

export const positionCommand = {
  name: 'mouse_position',

  async execute(): Promise<string> {
    const mousePos = await mouse.getPosition();
    return `${this.name} ${mousePos.x},${mousePos.y}`;
  },
};
