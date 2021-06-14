import { MoveDirection } from '@/types/move-direction.type';
import { Position } from '@/position';
import { Movable } from '@/types/movable.interface';
export declare class Block implements Movable {
    readonly position: Position;
    readonly color: string;
    constructor(position: Position, color: string);
    move<T extends Block>(direction: MoveDirection, steps: number): T;
    round<T extends Block>(): T;
}
