// expands object types one level deep
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

// expands object types recursively
export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T
// distributive conditional types
// ref: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never

// Another implementation of Distributive Pick
// Ref https://dev.to/safareli/pick-omit-and-union-types-in-typescript-4nd9
export type Keys<T> = keyof T
export type DistributiveKeys<T> = T extends unknown ? Keys<T> : never
export type DistributivePick<
  T,
  K extends DistributiveKeys<T>
> = T extends unknown ? Pick<T, Extract<keyof T, K>> : never

// export type DistributiveOmit<
//   T,
//   K extends DistributiveKeys<T>
// > = T extends unknown ? Omit<T, Extract<keyof T, K>> : never

// React related types

export type ReducerAction<O, U extends string> = {
  [K in keyof O]: {
    type: U
    field: K
    value: O[K]
  }
}[keyof O]

export type ReducerActionBatch<O, U extends string> = {
  type: U
  state: Partial<O>
}

export type ReducerDispatcher<
  O,
  U extends string,
  Batch extends boolean = false
> = (
  state: O,
  action: Batch extends true ? ReducerActionBatch<O, U> : ReducerAction<O, U>
) => O

export type Awaitable<T> = T | Promise<T>
