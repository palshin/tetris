import { Figure } from '@/figure';
import { MoveDirection } from '@/types/move-direction.type';
import { Block } from '@/block';

export interface TetrisState {
  time: number;
  score: number;
  baseSpeed: number;
  speed: number;
  pressedKeys: {
    [k in MoveDirection | 'rotateClockwise' | 'rotateCounterClockwise']: boolean;
  };
  fallenBlocks: Block[];
  figure: {
    current: Figure | null;
    next: Figure | null;
  };
}
