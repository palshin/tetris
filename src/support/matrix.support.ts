import { RotationAngle } from '@/types/rotation-angle.type';

export const Matrix = {
  rotate<T>(matrix: readonly T[][], rotationAngle: RotationAngle, clockwise: boolean): T[][] {
    // сводим все вращения матрицы к случаю вращения по часовой стрелке на 90 градусов
    // для этого вычисляем, сколько раз нам нужно так повернуть матрицу: 0, 1, 2 или 3
    let count = 0;
    if ((rotationAngle === 90 && clockwise) || (rotationAngle === 270 && !clockwise)) {
      count = 1;
    } else if (rotationAngle === 180) {
      count = 2;
    } else if ((rotationAngle === 270 && clockwise) || (rotationAngle === 90 && !clockwise)) {
      count = 3;
    }
    let rotatedMatrix: T[][] = matrix as T[][];
    while (count) {
      rotatedMatrix = this.rotate90Clockwise(rotatedMatrix);
      count -= 1;
    }

    return rotatedMatrix;
  },

  rotate90Clockwise<T>(matrix: readonly T[][]): T[][] {
    return matrix[0].map((value, index) => matrix.map((row) => row[index]).reverse());
  },
};
