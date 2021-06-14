import { Movable } from '@/types/movable.interface';
import { MoveDirection } from '@/types/move-direction.type';
export declare class Position implements Movable {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    move<T extends Position>(direction: MoveDirection, steps: number): T;
    isValid(): boolean;
    round<T extends Position>(): T;
}
