/**
 * This module targets readonly objects in the sense of product types. For
 * readonly objects in the sense of maps see the `Record` module.
 *
 * @since 0.14.0
 */

import { pipe } from "fp-ts/function"
import * as RR from "fp-ts/ReadonlyRecord"
import * as RA from "fp-ts/ReadonlyArray"
import { fanout } from "./Tuple"
import { uncurry2 } from "./Function"

/**
 * Merge two records together. For merging many identical records, instead
 * consider defining a semigroup.
 *
 * @example
 * import { merge } from 'fp-ts-std/ReadonlyStruct'
 *
 * assert.deepStrictEqual(merge({ a: 1, b: 2 })({ b: 'two', c: true }), { a: 1, b: 'two', c: true })
 *
 * @since 0.14.0
 */
// This combination of type arguments works with both partial application and
// the likes of `uncurry2`.
export const merge =
  <A, B>(x: A) =>
  <C extends B>(y: C): A & C => ({ ...x, ...y })

/**
 * Pick a set of keys from a `Record`. The value-level equivalent of the `Pick`
 * type.
 *
 * @example
 * import { pick } from 'fp-ts-std/ReadonlyStruct'
 * import { pipe } from 'fp-ts/function'
 *
 * const picked = pipe(
 *   { a: 1, b: 'two', c: [true] },
 *   pick(['a', 'c'])
 * )
 *
 * assert.deepStrictEqual(picked, { a: 1, c: [true] })
 *
 * @since 0.14.0
 */
export const pick =
  <A, K extends keyof A>(ks: ReadonlyArray<K>) =>
  (x: A): Pick<A, K> =>
    // I don't believe there's any reasonable way to model this sort of
    // transformation in the type system without an assertion - at least here
    // it's in a single reused place
    pipe(
      ks,
      RA.reduce({} as Pick<A, K>, (ys, k) =>
        merge(ys)(k in x ? { [k]: x[k] } : {}),
      ),
    )

//   {
//   const o = {} as Pick<A, K>
//
//   /* eslint-disable */
//   for (const k of ks) {
//     o[k] = x[k]
//   }
//   /* eslint-enable */
//
//   return o
// }

/**
 * Like `pick`, but allows you to specify the input record upfront.
 *
 * @example
 * import { pickFrom } from 'fp-ts-std/ReadonlyStruct'
 *
 * type MyType = { a: number; b: string; c: ReadonlyArray<boolean> }
 * const picked = pickFrom<MyType>()(['a', 'c'])
 *
 * assert.deepStrictEqual(picked({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
 *
 * @since 0.14.0
 */
export const pickFrom = <A>(): (<K extends keyof A>(
  ks: ReadonlyArray<K>,
) => (x: A) => Pick<A, K>) => pick

/**
 * Omit a set of keys from a `Record`. The value-level equivalent of the `Omit`
 * type.
 *
 * @example
 * import { omit } from 'fp-ts-std/ReadonlyStruct'
 *
 * const sansB = omit(['b'])
 *
 * assert.deepStrictEqual(sansB({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
 *
 * @since 0.14.0
 */
export const omit =
  <K extends string>(ks: ReadonlyArray<K>) =>
  <V, A extends RR.ReadonlyRecord<K, V>>(x: A): Omit<A, K> => {
    const y = { ...x }

    /* eslint-disable */
    for (const k of ks) {
      delete y[k]
    }
    /* eslint-enable */

    return y as Omit<A, K>
  }

/**
 * Like `omit`, but allows you to specify the input record upfront.
 *
 * @example
 * import { omitFrom } from 'fp-ts-std/ReadonlyStruct'
 *
 * type MyType = { a: number; b: string; c: ReadonlyArray<boolean> }
 * const sansB = omitFrom<MyType>()(['b'])
 *
 * assert.deepStrictEqual(sansB({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
 *
 * @since 0.15.0
 */
export const omitFrom = <A>(): (<K extends keyof A & string>(
  ks: ReadonlyArray<K>,
) => (x: A) => Omit<A, K>) => omit

type OptionalKeys<O extends object> = {
  [K in keyof O]-?: RR.ReadonlyRecord<string, unknown> extends Pick<O, K>
    ? K
    : never
}[keyof O]

type Exact<A extends Readonly<object>, B extends A> = A &
  Readonly<Record<Exclude<keyof B, keyof A>, never>>

/**
 * Provide default values for an object with optional properties.
 *
 * @example
 * import { withDefaults } from 'fp-ts-std/ReadonlyStruct'
 * import { pipe } from 'fp-ts/function'
 *
 * const aOptB: { a: number; b?: string } = { a: 1 }
 *
 * assert.deepStrictEqual(pipe(aOptB, withDefaults({ b: 'foo' })), { a: 1, b: 'foo' })
 *
 * @since 0.15.0
 */
export const withDefaults: <
  T extends RR.ReadonlyRecord<string, unknown>,
  PT extends Exact<{ [K in OptionalKeys<T>]-?: Exclude<T[K], undefined> }, PT>,
>(
  defaults: PT,
) => (t: T) => Readonly<PT & T> = merge

type MaybePartial<A> = A | Partial<A>

type RenameKey<
  A extends RR.ReadonlyRecord<string, unknown>,
  I extends keyof A,
  J extends string,
> = Readonly<{
  [K in keyof A as K extends I ? J : K]: A[K]
}>

/**
 * Rename a key in a struct, preserving the value. If the new key already
 * exists, the old key will be overwritten. Optionality is preserved.
 *
 * @example
 * import { renameKey } from 'fp-ts-std/Struct'
 *
 * type Foo = { a: string; b: number }
 * type Bar = { a: string; c: number }
 *
 * const fooBar: (x: Foo) => Bar = renameKey('b')('c')
 *
 * @since 0.15.0
 */
export const renameKey =
  <I extends string>(oldK: I) =>
  <J extends string>(newK: J) =>
  // Can't be pointfree, need references to `A`.
  <A extends MaybePartial<RR.ReadonlyRecord<I, unknown>>>(
    x: A,
  ): RenameKey<A, I, J> => {
    const newO = (x: A) => (oldK in x ? { [newK]: x[oldK] } : {})

    return pipe(
      x,
      fanout(omitFrom<A>()([oldK]))(newO),
      uncurry2(merge),
    ) as unknown as RenameKey<A, I, J>
  }
