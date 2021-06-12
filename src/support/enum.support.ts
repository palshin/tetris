export const Enum = {
  keys<T extends Record<string | number, string | number>>(EnumObject: T): Array<keyof T> {
    return Object.keys(EnumObject).filter((k) => typeof EnumObject[k as string] === 'number');
  },

  values<T extends Record<string | number, string | number>>(EnumObject: T): Array<number> {
    return this.keys(EnumObject).map((k) => EnumObject[k] as number);
  },
};
