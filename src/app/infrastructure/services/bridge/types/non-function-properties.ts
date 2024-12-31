type IsFunction<T> = T extends (...args: unknown[]) => unknown ? true : false;

export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: IsFunction<T[K]> extends true ? never : K;
}[keyof T];

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
