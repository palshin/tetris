import { Block } from '@/block';
import { Figure } from '@/figure';
import { TetrisConfig } from '@/types/tetris-config.interface';
import { TetrisState } from '@/types/tetris-state.interface';
import { CanvasRenderer } from '@/renderers/canvas.renderer';
import { FigureType } from '@/types/figure-type.enum';
import { FigureFactory } from '@/figures/figure.factory';
import { Position } from '@/types/position.interface';

const DEFAULT_TETRIS_CONFIG: TetrisConfig = {
  length: 400,
  blocksCount: 10,
  backgroundColor: '#112233',
  borderColor: 'white',
};

/**
 * Game logic
 */
export class Tetris {
  readonly config: TetrisConfig;

  readonly state: TetrisState;

  readonly blockLength: number;

  /**
   * matrix of game "pixels" (or blocks)
   */
  readonly matrix: Block[][];

  /**
   * @param renderer - renderer that delegate drawing operations
   * @param config - game initial config object
   */
  constructor(readonly renderer: CanvasRenderer, config: Readonly<Partial<TetrisConfig>>) {
    this.config = { ...DEFAULT_TETRIS_CONFIG, ...(config || {}) };

    this.blockLength = this.config.length / this.config.blocksCount;

    this.state = {
      time: 0,
      score: 0,
      figure: {
        current: this.generateFigure(this.startPosition),
        next: this.generateFigure(this.startPosition),
      },
      fallenBlocks: [],
      pressedKeys: {
        up: false,
        down: false,
        left: false,
        right: false,
      },
    };

    this.matrix = [];
    for (let x = 0; x < this.config.blocksCount; x += 1) {
      this.matrix[x] = [];
      for (let y = 0; y < this.config.blocksCount * 2; y += 1) {
        this.matrix[x][y] = new Block({ x, y }, this.config.backgroundColor);
      }
    }

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.state.pressedKeys.left = true;
          break;
        case 'ArrowRight':
          this.state.pressedKeys.right = true;
          break;
        case 'ArrowDown':
          this.state.pressedKeys.down = true;
          break;
        case 'ArrowUp':
          this.state.pressedKeys.up = true;
          break;
        default:
      }
    });

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.state.pressedKeys.left = true;
          break;
        case 'ArrowRight':
          this.state.pressedKeys.right = true;
          break;
        case 'ArrowDown':
          this.state.pressedKeys.down = true;
          break;
        case 'ArrowUp':
          this.state.pressedKeys.up = true;
          break;
        default:
      }
    });
  }

  get startPosition(): Position {
    return {
      x: Math.floor(this.config.blocksCount / 2),
      y: -2,
    };
  }

  evolute(): void {
    this.renderer.clear();
    this.renderer.drawStage();

    // сначала отрисовываем пустые блоки
    this.drawBlockMatrix(this.matrix);

    // теперь отрисовываем падающую фигуру
    if (this.state.figure.current) {
      this.drawBlocks(this.state.figure.current.getBlocks());
    }

  }

  drawBlocks(blocks: readonly Block[]): void {
    blocks.forEach((block) => this.renderer.drawBlock(block));
  }

  drawBlockMatrix(blockMatrix: readonly Block[][]): void {
    blockMatrix.forEach((blocks) => this.drawBlocks(blocks));
  }

  readonly generateFigure = (position: Position): Figure => {
    return FigureFactory.makeFigure(FigureType.Square, position, '#00FF00');
  }
}
