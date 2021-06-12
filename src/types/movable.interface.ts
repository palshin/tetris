import { MoveDirection } from '@/types/move-direction.type';

export interface Movable {
  move(direction: MoveDirection, step: number): Movable;
}
