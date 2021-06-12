import { Figure } from '@/figure';
import { Square } from '@/figures/square.figure';
import { FigureType } from '@/types/figure-type.enum';
import { Position } from '@/position';

export const FigureFactory = {
  makeFigure(type: FigureType, position: Position, color: string): Figure {
    switch (type) {
      case FigureType.Square:
        return new Square(position, color);
      default:
        return new Square(position, color);
    }
  },
};
