import { Figure } from '@/figure';

export class LeftSnakeFigure extends Figure {
  protected initialMatrix(): boolean[][] {
    return [
      [false, true, false],
      [true, true, false],
      [true, false, false],
    ];
  }
}
