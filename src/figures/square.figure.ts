import { Figure } from '@/figure';
import { Position } from '@/types/position.interface';
import { Block } from '@/block';
import { Movable } from '@/types/movable.interface';
import { MoveDirection } from '@/types/move-direction.type';

export class Square extends Figure implements Movable {
  constructor(protected readonly position: Position, protected readonly color: string) {
    super(position, color);

    this.blocks = [
      new Block(position, color),
      new Block({ x: position.x + 1, y: position.y }, color),
      new Block({ x: position.x, y: position.y + 1 }, color),
      new Block({ x: position.x + 1, y: position.y + 1 }, color),
    ];
  }

  move(direction: MoveDirection, step = 1): Square {
    const square = new Square(this.position, this.color);
    for (const block of square.blocks) {
      block.move(direction, step);
    }

    return square;
  }
}
