/* eslint-disable unicorn/prevent-abbreviations */
import { Figure } from '@/figure';
import { Position } from '@/position';
import { Block } from '@/block';

export class IFigure extends Figure {
  public readonly blocks: Block[];

  constructor(public readonly position: Position, public readonly color: string) {
    super(position, color);

    this.blocks = [
      new Block(position, color),
      new Block(new Position(position.x, position.y + 1), color),
      new Block(new Position(position.x, position.y + 2), color),
      new Block(new Position(position.x, position.y + 3), color),
    ];
  }
}
