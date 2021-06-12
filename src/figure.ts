import { Block } from '@/block';
import { Movable } from '@/types/movable.interface';
import { MoveDirection } from '@/types/move-direction.type';
import { Position } from '@/types/position.interface';

type FigureConstructor<T> = new (position: Position, color: string) => T;

export abstract class Figure implements Movable {
  protected blocks: Block[] = [];

  protected constructor(protected readonly position: Position, protected readonly color: string) { }

  move<T extends Figure>(direction: MoveDirection, step: number): T {
    const figure = new (this.constructor as FigureConstructor<T>)(this.position, this.color);
    figure.blocks.forEach((block) => block.move(direction, step));

    return figure;
  }

  getBlocks(): Block[] {
    return this.blocks;
  }
}
