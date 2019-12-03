export type ExcludeMethods<T> =
  Pick<T, { [K in keyof T]: T[K] extends (_: any) => any ? never : K }[keyof T]>;

export function getDifference<T>(original: T[], now: T[]): { add: T[], remove: T[] } {
  return {
    add: now.filter(el => !original.includes(el)),
    remove: original.filter(el => !now.includes(el)),
  };
}
