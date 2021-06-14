export declare const Enum: {
    keys<T extends Record<string | number, string | number>>(EnumObject: T): (keyof T)[];
    values<T_1 extends Record<string | number, string | number>>(EnumObject: T_1): Array<number>;
};
