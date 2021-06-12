import { MoveDirection } from '@/types/move-direction.type';
import { Position } from '@/position';
import { Movable } from '@/types/movable.interface';

type BlockConstructor<T> = new (position: Position, color: string) => T;

export class Block implements Movable {
  constructor(public readonly position: Position, public readonly color: string) {
    Object.freeze(this);
  }

  move<T extends Block>(direction: MoveDirection, steps: number): T {
    const Static = this.constructor as BlockConstructor<T>;

    return new Static(this.position.move(direction, steps), this.color);
  }

  round<T extends Block>(): T {
    const Static = this.constructor as BlockConstructor<T>;

    return new Static(this.position.round(), this.color);
  }
}
