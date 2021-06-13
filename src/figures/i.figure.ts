/* eslint-disable unicorn/prevent-abbreviations */
import { Figure } from '@/figure';

export class IFigure extends Figure {
  protected initialMatrix(): boolean[][] {
    return [
      [false, false, true, false],
      [false, false, true, false],
      [false, false, true, false],
      [false, false, true, false],
    ];
  }
}
