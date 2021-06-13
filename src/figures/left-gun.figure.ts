import { Figure } from '@/figure';

export class LeftGunFigure extends Figure {
  protected initialMatrix(): boolean[][] {
    return [
      [false, false, true],
      [false, false, true],
      [false, true, true],
    ];
  }
}
