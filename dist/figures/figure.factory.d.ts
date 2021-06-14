import { Figure } from '@/figure';
import { FigureType } from '@/types/figure-type.enum';
import { Position } from '@/position';
export declare const FigureFactory: {
    make(type: FigureType, position: Position, color: string): Figure;
    makeRandom(position: Position): Figure;
};
