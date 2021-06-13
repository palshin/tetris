import { Figure } from '@/figure';

export class SquareFigure extends Figure {
  protected initialMatrix(): boolean[][] {
    return [
      [true, true],
      [true, true],
    ];
  }
}
