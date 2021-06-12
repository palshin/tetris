import { Movable } from '@/types/movable.interface';
import { MoveDirection } from '@/types/move-direction.type';

type PositionConstructor<T> = new (x: number, y: number) => T;

export class Position implements Movable {
  constructor(public readonly x: number, public readonly y: number) {
    Object.freeze(this);
  }

  move<T extends Position>(direction: MoveDirection, steps: number): T {
    const Static = this.constructor as PositionConstructor<T>;
    let { x, y } = this;

    switch (direction) {
      case 'down':
        y += steps;
        break;
      case 'up':
        y -= steps;
        break;
      case 'left':
        x -= steps;
        break;
      case 'right':
        x += steps;
        break;
      default:
    }

    return new Static(x, y);
  }

  isValid(): boolean {
    return this.x > -4 && this.y > -4;
  }
}
