import { Figure } from '@/figure';

export class RightGunFigure extends Figure {
  protected initialMatrix(): boolean[][] {
    return [
      [false, true, false],
      [false, true, false],
      [false, true, true],
    ];
  }
}
