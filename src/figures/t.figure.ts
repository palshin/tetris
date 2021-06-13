/* eslint-disable unicorn/prevent-abbreviations */
import { Figure } from '@/figure';

export class TFigure extends Figure {
  protected initialMatrix(): boolean[][] {
    return [
      [true, true, true],
      [false, true, false],
      [false, false, false],
    ];
  }
}
