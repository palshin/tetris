import { Figure } from '@/figure';
import { MoveDirection } from '@/types/move-direction.type';
import { Block } from '@/block';

export interface TetrisState {
  time: number;
  score: 0;
  pressedKeys: {
    [k in MoveDirection]: boolean;
  };
  fallenBlocks: Block[];
  figure: {
    current: Figure | null;
    next: Figure | null;
  };
}