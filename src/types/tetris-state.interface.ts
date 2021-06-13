import { Figure } from '@/figure';
import { MoveDirection } from '@/types/move-direction.type';

export interface TetrisState {
  time: number;
  score: number;
  baseSpeed: number;
  speed: number;
  pressedKeys: {
    [k in MoveDirection | 'rotateClockwise' | 'rotateCounterClockwise']: boolean;
  };
  figure: {
    current: Figure | null;
    next: Figure | null;
  };
}
