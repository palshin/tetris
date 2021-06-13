import { Block } from '@/block';
import { Movable } from '@/types/movable.interface';
import { MoveDirection } from '@/types/move-direction.type';
import { Position } from '@/position';
import { RotationAngle } from '@/types/rotation-angle.type';
import { Matrix } from '@/support/matrix.support';

type FigureConstructor<T> = new (position: Position, color: string, rotationAngle?: RotationAngle) => T;

export abstract class Figure implements Movable {
  protected abstract initialMatrix(): boolean[][];

  protected readonly matrix: boolean[][];

  public constructor(
    public readonly position: Position,
    public readonly color: string,
    public readonly rotationAngle: RotationAngle = 0,
  ) {
    this.matrix = Matrix.rotate(this.initialMatrix(), rotationAngle, true);
  }

  public isValidPosition(): boolean {
    return this.blocks.every((block) => block.position.isValid());
  }

  public get blocks(): Block[] {
    const blocks: Block[] = [];
    this.matrix.forEach((row, xIndex) => {
      row.forEach((element, yIndex) => {
        if (element) {
          const block = new Block(new Position(this.position.x + xIndex, this.position.y + yIndex), this.color);
          blocks.push(block);
        }
      });
    });

    return blocks;
  }

  public move<T extends Figure>(direction: MoveDirection, steps: number): T {
    const Static = this.constructor as FigureConstructor<T>;

    return new Static(this.position.move(direction, steps), this.color, this.rotationAngle);
  }

  public rotate<T extends Figure>(clockwise: boolean): T {
    const Static = this.constructor as FigureConstructor<T>;

    const rotations: RotationAngle[] = [0, 90, 180, 270];
    const rotationIndex = rotations.indexOf(this.rotationAngle);
    const nextRotationIndex = clockwise
      ? (rotationIndex + 1) % rotations.length
      : (rotationIndex + 3) % rotations.length;

    return new Static(this.position, this.color, rotations[nextRotationIndex]);
  }

  public round<T extends Figure>(): T {
    const Static = this.constructor as FigureConstructor<T>;

    return new Static(this.position.round(), this.color);
  }
}
