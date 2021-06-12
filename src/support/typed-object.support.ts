export const TypedObject = {
  keys: Object.keys as <T extends Record<string, unknown>>(object: T) => Array<keyof T>,
};
