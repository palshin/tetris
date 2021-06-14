import { Figure } from '@/figure';
import { ControlKey } from '@/types/control-key.type';
export interface TetrisState {
    time: number;
    score: number;
    level: number;
    speed: number;
    pressedKeys: {
        [k in ControlKey]: boolean;
    };
    figure: {
        current: Figure;
        next: Figure;
    };
}
