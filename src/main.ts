import { KeyboardInputController } from '@/input-controllers/keyboard.input-controller';
import { CanvasRenderer } from '@/renderers/canvas.renderer';
import '@/styles/app.scss';
import { Tetris } from '@/tetris';

document.addEventListener('DOMContentLoaded', () => {
  const gameFieldCanvas: HTMLCanvasElement | null = document.querySelector('#gameField');
  const gameFieldContext = gameFieldCanvas?.getContext('2d');

  if (gameFieldContext) {
    const canvasRenderer = new CanvasRenderer(gameFieldContext, { fieldLength: 400, length: 650 });
    const keyboardController = new KeyboardInputController();
    const tetris = new Tetris(canvasRenderer, keyboardController);
    console.clear();
    tetris.start();
  }
});
