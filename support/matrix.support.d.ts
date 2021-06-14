import { RotationAngle } from '@/types/rotation-angle.type';
export declare const Matrix: {
    rotate<T>(matrix: readonly T[][], rotationAngle: RotationAngle, clockwise: boolean): T[][];
    rotate90Clockwise<T_1>(matrix: readonly T_1[][]): T_1[][];
};
