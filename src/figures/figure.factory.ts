import { Figure } from '@/figure';
import { SquareFigure } from '@/figures/square.figure';
import { FigureType } from '@/types/figure-type.enum';
import { Position } from '@/position';
import { IFigure } from '@/figures/i.figure';
import { Enum } from '@/support/enum.support';
import { Random } from '@/support/random.support';
import { TFigure } from '@/figures/t.figure';
import { LeftGunFigure } from '@/figures/left-gun.figure';
import { RightGunFigure } from '@/figures/right-gun.figure';
import { LeftSnakeFigure } from '@/figures/left-snake.figure';
import { RightSnakeFigure } from '@/figures/right-snake.figure';

const COLORS = [
  '#0341AE', // Cobalt Blue
  '#72CB3B', // Apple
  '#FFD500', // Cyber Yellow
  '#FF971C', // Beer
  '#FF3213', // RYB Red
];

export const FigureFactory = {
  make(type: FigureType, position: Position, color: string): Figure {
    switch (type) {
      case FigureType.Square:
        return new SquareFigure(position, color);
      case FigureType.I:
        return new IFigure(position, color);
      case FigureType.T:
        return new TFigure(position, color);
      case FigureType.LeftGun:
        return new LeftGunFigure(position, color);
      case FigureType.RightGun:
        return new RightGunFigure(position, color);
      case FigureType.LeftSnake:
        return new LeftSnakeFigure(position, color);
      case FigureType.RightSnake:
        return new RightSnakeFigure(position, color);
      default:
        return new IFigure(position, color);
    }
  },

  makeRandom(position: Position): Figure {
    const keys = Enum.keys(FigureType);
    const randomEnum = Random.arrayElement(keys);
    const randomColor = Random.arrayElement(COLORS);

    return this.make(FigureType[randomEnum], position, randomColor);
  }
};
