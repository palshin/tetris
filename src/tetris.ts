import { Block } from '@/block';
import { Figure } from '@/figure';
import { TetrisConfig } from '@/types/tetris-config.interface';
import { TetrisState } from '@/types/tetris-state.interface';
import { CanvasRenderer } from '@/renderers/canvas.renderer';
import { FigureType } from '@/types/figure-type.enum';
import { FigureFactory } from '@/figures/figure.factory';
import { Position } from '@/position';
import { MoveDirection } from '@/types/move-direction.type';

type Callback = () => void;

interface SideBound {
  from: number;
  to: number;
}

interface Bounds {
  x: SideBound;
  y: SideBound;
}

const DEFAULT_TETRIS_CONFIG: TetrisConfig = {
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

  /**
   * matrix of game "pixels" (or blocks)
   */
  readonly matrix: Block[][];

  private callbacks: Callback[] = [];

  /**
   * @param renderer - renderer that delegate drawing operations
   * @param config - game initial config object
   */
  constructor(protected readonly renderer: CanvasRenderer, config: Readonly<Partial<TetrisConfig>> = {}) {
    this.config = { ...DEFAULT_TETRIS_CONFIG, ...config };

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
        this.matrix[x][y] = new Block(new Position(x, y), this.config.backgroundColor);
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
          this.state.pressedKeys.left = false;
          break;
        case 'ArrowRight':
          this.state.pressedKeys.right = false;
          break;
        case 'ArrowDown':
          this.state.pressedKeys.down = false;
          break;
        case 'ArrowUp':
          this.state.pressedKeys.up = false;
          break;
        default:
      }
    });
  }

  get startPosition(): Position {
    return new Position(Math.floor(this.config.blocksCount / 2), -2);
  }

  get bounds(): Bounds {
    return {
      x: {
        from: 0,
        to: this.config.blocksCount - 1,
      },
      y: {
        from: -4,
        to: this.config.blocksCount * 2 - 1,
      },
    };
  }

  evolute(): void {
    console.log(this.state);
    // перед началом каждого тика выполняем колбеки
    this.executeCallbacks();

    this.renderer.clear();
    this.renderer.drawStage();

    // сначала отрисовываем пустые блоки
    this.drawBlockMatrix(this.matrix);

    // теперь отрисовываем упавшие блоки
    this.state.fallenBlocks.forEach((block) => this.renderer.drawBlock(block));

    // теперь отрисовываем падающую фигуру
    if (this.state.figure.current) {
      // высчитываем следующую позицию для падающей фигуры
      this.evoluteCurrentFigure();
      // отрисовываем фигуру
      this.drawBlocks(this.state.figure.current.blocks);
    } else {
      this.nextTick(() => {
        this.state.figure.current = this.state.figure.next;
        this.state.figure.next = this.generateFigure(this.startPosition);
      });
    }

    setTimeout(() => {
      this.evolute();
    }, 500);
  }

  evoluteCurrentFigure(): void {
    let currentFigure = this.state.figure.current;
    if (!currentFigure) {
      return;
    }
    // всегда опускаем на 1 вниз
    const canMoveDown = this.canMove(currentFigure, 'down', 1);
    if (!canMoveDown) {
      this.nextTick(() => {
        this.addFigureToFallenBlocks(currentFigure!);
        this.state.figure.current = this.generateFigure(this.startPosition);
      });
    } else {
      currentFigure = currentFigure.move('down', 1);
    }
    if (this.state.pressedKeys.left && this.canMove(currentFigure, 'left', 1)) {
      currentFigure = currentFigure.move('left', 1);
    }
    if (this.state.pressedKeys.right && this.canMove(currentFigure, 'right', 1)) {
      currentFigure = currentFigure.move('right', 1);
    }
    this.state.figure.current = currentFigure;
  }

  addFigureToFallenBlocks(figure: Figure): void {
    this.state.fallenBlocks.push(...figure.blocks);
  }

  canMove(figure: Figure, direction: MoveDirection, steps: number): boolean {
    const nextFigure = figure.move(direction, steps);

    return (
      nextFigure.isValidPosition() &&
      nextFigure.blocks.every((block) => !this.hasIntersectionWithFallenBlocks(block)) &&
      nextFigure.blocks.every((block) => !this.goesOutOfBounds(block))
    );
  }

  hasIntersectionWithFallenBlocks(block: Block): boolean {
    return this.state.fallenBlocks.some((b) => b.position.x === block.position.x && b.position.y === block.position.y);
  }

  goesOutOfBounds(block: Block): boolean {
    return (
      this.bounds.x.from > block.position.x ||
      this.bounds.x.to < block.position.x ||
      this.bounds.y.from > block.position.y ||
      this.bounds.y.to < block.position.y
    );
  }

  nextTick(callback: Callback): void {
    this.callbacks.push(callback);
  }

  executeCallbacks(): void {
    this.callbacks.forEach((callback) => callback());
    this.callbacks.length = 0;
  }

  drawBlocks(blocks: readonly Block[]): void {
    blocks.forEach((block) => this.renderer.drawBlock(block));
  }

  drawBlockMatrix(blockMatrix: readonly Block[][]): void {
    blockMatrix.forEach((blocks) => this.drawBlocks(blocks));
  }

  readonly generateFigure = (position: Position): Figure => {
    return FigureFactory.makeFigure(FigureType.Square, position, '#00FF00');
  };
}
