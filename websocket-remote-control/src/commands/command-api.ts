import { CommandApi } from '#src/types.js';

import { drawCircleCommand } from './draw/draw-circle-command.js';
import { drawRectangleCommand } from './draw/draw-rectangle-command.js';
import { drawSquareCommand } from './draw/draw-square-command.js';
import { mouseDownCommand } from './mouse/mouse-down-command.js';
import { mouseRightCommand } from './mouse/mouse-right-command.js';
import { mouseUpCommand } from './mouse/mouse-up-command.js';
import { mouseLeftCommand } from './mouse/move-left-command.js';
import { positionCommand } from './mouse/position-command.js';
import { screenshotCommand } from './screen/screenshot-command.js';

export const commandApi: CommandApi = {
  [drawCircleCommand.name]: drawCircleCommand,
  [drawRectangleCommand.name]: drawRectangleCommand,
  [drawSquareCommand.name]: drawSquareCommand,
  [mouseDownCommand.name]: mouseDownCommand,
  [mouseLeftCommand.name]: mouseLeftCommand,
  [positionCommand.name]: positionCommand,
  [mouseRightCommand.name]: mouseRightCommand,
  [mouseUpCommand.name]: mouseUpCommand,
  [screenshotCommand.name]: screenshotCommand,
};
