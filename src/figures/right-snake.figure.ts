import { Figure } from '@/figure';

export class RightSnakeFigure extends Figure {
  protected initialMatrix(): boolean[][] {
    return [
      [false, true, false],
      [false, true, true],
      [false, false, true],
    ];
  }
}
