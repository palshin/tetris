/* eslint-disable unicorn/prevent-abbreviations */
import { Figure } from '@/figure';
import { Position } from '@/position';
import { Block } from '@/block';

export class TFigure extends Figure {
  public readonly blocks: Block[];

  constructor(public readonly position: Position, public readonly color: string) {
    super(position, color);

    this.blocks = [
      new Block(position, color),
      new Block(new Position(position.x + 1, position.y), color),
      new Block(new Position(position.x + 2, position.y), color),
      new Block(new Position(position.x + 1, position.y + 1), color),
    ];
  }
}
