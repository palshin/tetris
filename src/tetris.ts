import { Block } from '@/block';
import { Figure } from '@/figure';
import { TetrisConfig } from '@/types/tetris-config.interface';
import { TetrisState } from '@/types/tetris-state.interface';
import { CanvasRenderer } from '@/renderers/canvas.renderer';
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
  private readonly config: TetrisConfig;

  private readonly state: TetrisState;

  /**
   * matrix of game "pixels" (or blocks)
   */
  private readonly matrix: Block[][];

  private callbacks: Callback[] = [];

  /**
   * @param renderer - renderer that delegate drawing operations
   * @param config - game initial config object
   */
  constructor(private readonly renderer: CanvasRenderer, config: Readonly<Partial<TetrisConfig>> = {}) {
    this.config = { ...DEFAULT_TETRIS_CONFIG, ...config };

    this.state = {
      time: 0,
      score: 0,
      baseSpeed: 1000,
      speed: 1000, // ms for 1 round step
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

  private get startPosition(): Position {
    return new Position(Math.floor(this.config.blocksCount / 2), -2);
  }

  private get bounds(): Bounds {
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

  public start(): void {
    this.state.time = Date.now();
    this.draw();
    this.main();
  }

  private main(): void {
    const now = Date.now();
    this.state.speed = this.state.pressedKeys.down ? this.state.baseSpeed * 10 : this.state.baseSpeed;
    this.evolute(now - this.state.time);
    this.draw();
    this.state.time = now;
    requestAnimationFrame(this.main.bind(this));
  }

  private evolute(timeDelta: number): void {
    // перед началом каждого цилка выполняем колбеки
    this.executeCallbacks();

    if (this.state.figure.current) {
      // высчитываем позицию для падающей фигуры
      this.evoluteCurrentFigure(timeDelta);
    } else {
      this.nextTick(() => {
        this.state.figure.current = this.state.figure.next;
        this.state.figure.next = this.generateFigure(this.startPosition);
      });
    }
  }

  private draw(): void {
    // очищаем всю область
    this.renderer.clear();

    // рисуем сцену
    this.renderer.drawStage();

    // отрисовываем пустые блоки
    this.drawBlockMatrix();

    // отрисовываем падающую фигуру
    if (this.state.figure.current) {
      this.drawBlocks(this.state.figure.current.blocks);
    }

    // отрисовываем упавшие блоки
    this.state.fallenBlocks.forEach((block) => this.renderer.drawBlock(block));
  }

  private evoluteCurrentFigure(timeDelta: number): void {
    let currentFigure = this.state.figure.current;
    if (!currentFigure) {
      return;
    }
    const steps = this.getSteps(timeDelta);
    const canMoveDown = this.canMove(currentFigure, 'down', steps);
    if (!canMoveDown) {
      this.nextTick(() => {
        this.addFigureToFallenBlocks(currentFigure!);
        this.state.figure.current = this.generateFigure(this.startPosition);
      });
    } else {
      currentFigure = currentFigure.move('down', steps);
    }
    if (this.state.pressedKeys.left && this.canMove(currentFigure, 'left', steps)) {
      currentFigure = currentFigure.move('left', steps);
    }
    if (this.state.pressedKeys.right && this.canMove(currentFigure, 'right', steps)) {
      currentFigure = currentFigure.move('right', steps);
    }
    this.state.figure.current = currentFigure;
  }

  private getSteps(timeDelta: number): number {
    return (this.state.speed * timeDelta) / 1000 / 1000;
  }

  private addFigureToFallenBlocks(figure: Figure): void {
    this.state.fallenBlocks.push(...figure.round().blocks);
  }

  private canMove(figure: Figure, direction: MoveDirection, steps: number): boolean {
    const nextFigure = figure.move(direction, steps);

    return (
      nextFigure.isValidPosition() &&
      nextFigure.blocks.every((block) => !this.hasIntersectionWithFallenBlocks(block)) &&
      nextFigure.blocks.every((block) => !this.goesOutOfBounds(block))
    );
  }

  private hasIntersectionWithFallenBlocks(block: Block): boolean {
    const roundBlock = block.round();

    return this.state.fallenBlocks.some(
      (b) => b.position.x === roundBlock.position.x && b.position.y === roundBlock.position.y,
    );
  }

  private goesOutOfBounds(block: Block): boolean {
    const roundBlock = block.round();

    return (
      this.bounds.x.from > roundBlock.position.x ||
      this.bounds.x.to < roundBlock.position.x ||
      this.bounds.y.from > roundBlock.position.y ||
      this.bounds.y.to < roundBlock.position.y
    );
  }

  private nextTick(callback: Callback): void {
    this.callbacks.push(callback);
  }

  private executeCallbacks(): void {
    this.callbacks.forEach((callback) => callback());
    this.callbacks.length = 0;
  }

  private drawBlocks(blocks: readonly Block[]): void {
    blocks.forEach((block) => this.renderer.drawBlock(block));
  }

  private drawBlockMatrix(): void {
    this.matrix.forEach((blocks) => this.drawBlocks(blocks));
  }

  private readonly generateFigure = (position: Position): Figure => {
    return FigureFactory.makeRandom(position);
  };
}
