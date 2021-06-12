import { MoveDirection } from '@/types/move-direction.type';
import { Position } from '@/types/position.interface';
import { Movable } from '@/types/movable.interface';

export class Block implements Movable {
  constructor(readonly position: Position, readonly color: string) { }

  move(direction: MoveDirection, step = 1): void {
    switch (direction) {
      case 'down':
        this.position.y += step;
        break;
      case 'up':
        this.position.y -= step;
        break;
      case 'left':
        this.position.x -= step;
        break;
      case 'right':
        this.position.x += step;
        break;
      default:
    }
  }
}
