import { Block } from '@/block';
import { Movable } from '@/types/movable.interface';
import { MoveDirection } from '@/types/move-direction.type';
import { Position } from '@/position';

type FigureConstructor<T> = new (position: Position, color: string) => T;

export abstract class Figure implements Movable {
  public abstract readonly blocks: Block[];

  protected constructor(public readonly position: Position, public readonly color: string) { }

  isValidPosition(): boolean {
    return this.blocks.every((block) => block.position.isValid());
  }

  move<T extends Figure>(direction: MoveDirection, steps: number): T {
    const Static = this.constructor as FigureConstructor<T>;

    return new Static(this.position.move(direction, steps), this.color);
  }

  round<T extends Figure>(): T {
    const Static = this.constructor as FigureConstructor<T>;

    return new Static(this.position.round(), this.color);
  }
}
