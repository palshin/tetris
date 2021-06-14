import { KeyboardInputController } from '@/input-controllers/keyboard.input-controller';
import { CanvasRenderer } from '@/renderers/canvas.renderer';
import '@/styles/app.scss';
import { Tetris } from '@/tetris';

document.addEventListener('DOMContentLoaded', function () {
  const canvas: HTMLCanvasElement = document.querySelector('#game')!;
  canvas.width = 400;
  canvas.height = 800;
  const context = canvas.getContext('2d');

  if (context) {
    const canvasRenderer = new CanvasRenderer(context, { length: 400 });
    const keyboardController = new KeyboardInputController();
    const tetris = new Tetris(canvasRenderer, keyboardController);
    console.clear();
    tetris.start();
  }
});
