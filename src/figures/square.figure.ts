import { Figure } from '@/figure';
import { Position } from '@/types/position.interface';
import { Block } from '@/block';

export class Square extends Figure {
  constructor(protected readonly position: Position, protected readonly color: string) {
    super(position, color);

    this.blocks = [
      new Block(position, color),
      new Block({ x: position.x + 1, y: position.y }, color),
      new Block({ x: position.x, y: position.y + 1 }, color),
      new Block({ x: position.x + 1, y: position.y + 1 }, color),
    ];
  }
}
