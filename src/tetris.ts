import { Block } from '@/block';
import { Figure } from '@/figure';
import { TetrisConfig } from '@/types/tetris-config.interface';
import { TetrisState } from '@/types/tetris-state.interface';
import { CanvasRenderer } from '@/renderers/canvas.renderer';
import { FigureFactory } from '@/figures/figure.factory';
import { Position } from '@/position';
import { MoveDirection } from '@/types/move-direction.type';
import { InputObserver } from '@/types/input-observer.interface';
import { ControlKey } from '@/types/control-key.type';

type Callback = () => void;

const DEFAULT_TETRIS_CONFIG: TetrisConfig = {
  blocksCount: 10,
  backgroundColor: '#112233',
  borderColor: 'white',
  scoreMap: {
    1: 100,
    2: 300,
    3: 700,
    4: 1500,
  },
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
  constructor(
    private readonly renderer: CanvasRenderer,
    readonly inputObserver: InputObserver,
    config: Readonly<Partial<TetrisConfig>> = {},
  ) {
    this.config = { ...DEFAULT_TETRIS_CONFIG, ...config };

    this.state = {
      time: 0,
      score: 0,
      baseSpeed: 1000,
      speed: 1000, // ms for 1 round step
      figure: {
        current: this.generateFigure(),
        next: this.generateFigure(),
      },
      pressedKeys: {
        up: false,
        down: false,
        left: false,
        right: false,
        rotateClockwise: false,
        rotateCounterClockwise: false,
      },
    };

    this.matrix = [];
    for (let x = 0; x < this.config.blocksCount; x += 1) {
      this.matrix[x] = [];
      for (let y = 0; y < this.config.blocksCount * 2; y += 1) {
        this.matrix[x][y] = new Block(new Position(x, y), this.config.backgroundColor);
      }
    }

    inputObserver.subscribe('keyUp', (key: ControlKey) => {
      this.state.pressedKeys[key] = true;
    });

    inputObserver.subscribe('keyDown', (key: ControlKey) => {
      this.state.pressedKeys[key] = false;
    });
  }

  private get startPosition(): Position {
    return new Position(Math.floor(this.config.blocksCount / 2), -2);
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
  }

  private evolute(timeDelta: number): void {
    this.executeCallbacks();
    let currentFigure = this.state.figure.current;
    if (!currentFigure) {
      return;
    }
    if (this.state.pressedKeys.rotateClockwise && this.canRotate(currentFigure, true)) {
      currentFigure = currentFigure.rotate(true);
      this.state.pressedKeys.rotateClockwise = false;
    }

    if (this.state.pressedKeys.rotateCounterClockwise && this.canRotate(currentFigure, false)) {
      currentFigure = currentFigure.rotate(false);
      this.state.pressedKeys.rotateCounterClockwise = false;
    }

    const steps = this.getSteps(timeDelta);

    if (this.state.pressedKeys.left && this.canMove(currentFigure, 'left', Math.ceil(steps))) {
      currentFigure = currentFigure.move('left', Math.ceil(steps));
      this.state.pressedKeys.left = false;
    }
    if (this.state.pressedKeys.right && this.canMove(currentFigure, 'right', Math.ceil(steps))) {
      currentFigure = currentFigure.move('right', Math.ceil(steps));
      this.state.pressedKeys.right = false;
    }

    const canMoveDown = this.canMove(currentFigure, 'down', steps);
    if (!canMoveDown) {
      this.nextTick(() => {
        this.addFallenFigureToMatrix(currentFigure!);
        this.state.figure.current = this.state.figure.next;
        this.state.figure.next = this.generateFigure();
      });
    } else {
      currentFigure = currentFigure.move('down', steps);
    }
    this.state.figure.current = currentFigure;
  }

  private getSteps(timeDelta: number): number {
    return (this.state.speed * timeDelta) / 1000 / 1000;
  }

  private addFallenFigureToMatrix(figure: Figure): void {
    figure.round().blocks.forEach((block) => {
      this.matrix[block.position.x][block.position.y] = block;
    });
    this.removeFilledRows();
  }

  private canMove(figure: Figure, direction: MoveDirection, steps: number): boolean {
    const nextFigure = figure.move(direction, steps);

    return (
      nextFigure.isValidPosition() &&
      nextFigure.blocks.every((block) => !this.hasIntersectionWithFallenBlocks(block)) &&
      nextFigure.blocks.every((block) => !this.goesOutOfBounds(block))
    );
  }

  private removeFilledRows(): void {
    let removedRows = 0;
    for (let y = this.matrix[0].length - 1; y >= 0; y -= 1) {
      const isFilled = this.matrix.every((column) => !this.isEmptyBlock(column[y]));
      if (isFilled) {
        removedRows += 1;
        this.matrix.forEach((column) => column.splice(y, 1));
        this.matrix.forEach((column, x) => {
          const block = new Block(new Position(x, 0), this.config.backgroundColor);
          column.unshift(block);
        });
        y += 1;
      }
    }
    if (removedRows !== 0) {
      for (let x = 0; x < this.matrix.length; x += 1) {
        for (let y = 0; y < this.matrix[x].length; y += 1) {
          this.matrix[x][y] = new Block(new Position(x, y), this.matrix[x][y].color);
        }
      }
      this.addScore(removedRows);
    }
  }

  private addScore(rows: number): void {
    const score = this.config.scoreMap?.[rows as 1 | 2 | 3 | 4] || 0;

    this.state.score += score;
  }

  private canRotate(figure: Figure, clockwise: boolean): boolean {
    const nextFigure = figure.rotate(clockwise);

    return (
      nextFigure.isValidPosition() &&
      nextFigure.blocks.every((block) => !this.hasIntersectionWithFallenBlocks(block)) &&
      nextFigure.blocks.every((block) => !this.goesOutOfBounds(block))
    );
  }

  private hasIntersectionWithFallenBlocks(block: Block): boolean {
    const roundBlock = block.round();
    const matrixBlock = this.matrix?.[roundBlock.position.x]?.[roundBlock.position.y];

    return matrixBlock ? !this.isEmptyBlock(matrixBlock) : false;
  }

  private goesOutOfBounds(block: Block): boolean {
    const roundBlock = block.round();

    if (roundBlock.position.y <= 0) {
      return false;
    }

    return this.matrix?.[roundBlock.position.x]?.[roundBlock.position.y] === undefined;
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

  private generateFigure(): Figure {
    return FigureFactory.makeRandom(this.startPosition);
  }

  private isEmptyBlock(block: Block): boolean {
    return block.color === this.config.backgroundColor;
  }
}
