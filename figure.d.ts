import { Block } from '@/block';
import { Movable } from '@/types/movable.interface';
import { MoveDirection } from '@/types/move-direction.type';
import { Position } from '@/position';
import { RotationAngle } from '@/types/rotation-angle.type';
export declare abstract class Figure implements Movable {
    readonly position: Position;
    readonly color: string;
    readonly rotationAngle: RotationAngle;
    protected abstract initialMatrix(): boolean[][];
    protected readonly matrix: boolean[][];
    constructor(position: Position, color: string, rotationAngle?: RotationAngle);
    isValidPosition(): boolean;
    get blocks(): Block[];
    move<T extends Figure>(direction: MoveDirection, steps: number): T;
    rotate<T extends Figure>(clockwise: boolean): T;
    round<T extends Figure>(): T;
    moveToBegin<T extends Figure>(): T;
}
