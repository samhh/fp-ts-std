/**
 * This module targets objects in the sense of product types. For objects in
 * the sense of maps see the `Record` module.
 *
 * @since 0.14.0
 */

import { constant, flow, pipe } from "fp-ts/function"
import * as A from "fp-ts/Array"
import { fanout } from "./Tuple"
import { uncurry2 } from "./Function"
import { Eq } from "fp-ts/Eq"
import { Ord, contramap as contramapOrd } from "fp-ts/Ord"
import { Bounded } from "fp-ts/Bounded"
import { Enum, fromProductEnumFormula } from "./Enum"
import * as O from "fp-ts/Option"
import Option = O.Option
import { unsafeExpect as unsafeExpectO } from "./Option"
import * as Str from "fp-ts/string"
import { GT, EQ, LT } from "./Ordering"
import { Ordering } from "fp-ts/Ordering"
import { digits } from "./Number"
import * as Num from "fp-ts/number"
import { fst } from "fp-ts/Tuple"
import * as L from "./Lazy"
import { concatAll } from "fp-ts/Monoid"

/**
 * Merge two records together. For merging many identical records, instead
 * consider defining a semigroup.
 *
 * @example
 * import { merge } from 'fp-ts-std/Struct'
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
 * import { pick } from 'fp-ts-std/Struct'
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
  <A extends object, K extends keyof A>(ks: Array<K>) =>
  (x: A): Pick<A, K> =>
    // I don't believe there's any reasonable way to model this sort of
    // transformation in the type system without an assertion - at least here
    // it's in a single reused place.
    pipe(
      ks,
      A.reduce({} as Pick<A, K>, (ys, k) =>
        merge(ys)(k in x ? { [k]: x[k] } : {}),
      ),
    )

/**
 * Like `pick`, but allows you to specify the input record upfront.
 *
 * @example
 * import { pickFrom } from 'fp-ts-std/Struct'
 *
 * type MyType = { a: number; b: string; c: ReadonlyArray<boolean> }
 * const picked = pickFrom<MyType>()(['a', 'c'])
 *
 * assert.deepStrictEqual(picked({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
 *
 * @since 0.14.0
 */
export const pickFrom = <A extends object>(): (<K extends keyof A>(
  ks: Array<K>,
) => (x: A) => Pick<A, K>) => pick

/**
 * Omit a set of keys from a `Record`. The value-level equivalent of the `Omit`
 * type.
 *
 * @example
 * import { omit } from 'fp-ts-std/Struct'
 *
 * const sansB = omit(['b'])
 *
 * assert.deepStrictEqual(sansB({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
 *
 * @since 0.14.0
 */
export const omit =
  <K extends string>(ks: Array<K>) =>
  <V, A extends Record<K, V>>(x: A): Omit<A, K> => {
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
 * import { omitFrom } from 'fp-ts-std/Struct'
 *
 * type MyType = { a: number; b: string; c: ReadonlyArray<boolean> }
 * const sansB = omitFrom<MyType>()(['b'])
 *
 * assert.deepStrictEqual(sansB({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
 *
 * @since 0.15.0
 */
export const omitFrom = <A>(): (<K extends keyof A & string>(
  ks: Array<K>,
) => (x: A) => Omit<A, K>) => omit

type OptionalKeys<O extends object> = {
  [K in keyof O]-?: Record<string, unknown> extends Pick<O, K> ? K : never
}[keyof O]

type Exact<A extends object, B extends A> = A &
  Record<Exclude<keyof B, keyof A>, never>

/**
 * Provide default values for an object with optional properties.
 *
 * @example
 * import { withDefaults } from 'fp-ts-std/Struct'
 * import { pipe } from 'fp-ts/function'
 *
 * const aOptB: { a: number; b?: string } = { a: 1 }
 *
 * assert.deepStrictEqual(pipe(aOptB, withDefaults({ b: 'foo' })), { a: 1, b: 'foo' })
 *
 * @since 0.15.0
 */
export const withDefaults: <
  T extends object,
  PT extends Exact<{ [K in OptionalKeys<T>]-?: Exclude<T[K], undefined> }, PT>,
>(
  defaults: PT,
) => (t: T) => PT & T = merge

type MaybePartial<A> = A | Partial<A>

type RenameKey<
  A extends Record<string, unknown>,
  I extends keyof A,
  J extends string,
> = {
  [K in keyof A as K extends I ? J : K]: A[K]
}

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
  <A extends MaybePartial<Record<I, unknown>>>(x: A): RenameKey<A, I, J> => {
    const newO = (x: A) => (oldK in x ? { [newK]: x[oldK] } : {})

    return pipe(
      x,
      fanout(omitFrom<A>()([oldK]))(newO),
      uncurry2(merge),
    ) as unknown as RenameKey<A, I, J>
  }

type Eqs<A> = {
  [B in keyof A]: Eq<A[B]>
}

export const getEq = <A>(eqs: Eqs<A>): Eq<A> => {
  const ks = Object.keys(eqs) as Array<keyof A>

  return {
    equals: (x, y) =>
      pipe(
        ks,
        A.every(k => eqs[k].equals(x[k], y[k])),
      ),
  }
}

type Ords<A> = {
  [B in keyof A]: Ord<A[B]>
}

type StructKey = string | number | symbol
const StrCoerceOrd: Ord<StructKey> = contramapOrd<string, StructKey>(String)(
  Str.Ord,
)

// document keys checked in alphabetical order
export const getOrd = <A>(ords: Ords<A>): Ord<A> => {
  const ks = pipe(
    Object.keys(ords) as Array<keyof A>,
    A.sort<keyof A>(StrCoerceOrd),
  )

  return {
    ...getEq(ords),
    compare: (x, y) =>
      pipe(
        ks,
        A.findFirstMap<keyof A, Ordering>(k =>
          pipe(
            ords[k].compare(x[k], y[k]),
            O.fromPredicate(o => o !== EQ),
          ),
        ),
        O.getOrElse(constant(EQ)),
      ),
  }
}

type Boundeds<A> = {
  [B in keyof A]: Bounded<A[B]>
}

export const getBounded = <A>(boundeds: Boundeds<A>): Bounded<A> => {
  const ks = Object.keys(boundeds) as Array<keyof A>

  const top = {} as A
  const bottom = {} as A
  // eslint-disable-next-line functional/no-loop-statements
  for (const k of ks) {
    /* eslint-disable */
    top[k] = boundeds[k].top
    bottom[k] = boundeds[k].bottom
    /* eslint-enable */
  }

  return {
    ...getOrd(boundeds),
    top,
    bottom,
  }
}

type Enums<A> = {
  [B in keyof A]: Enum<A[B]>
}

/**
 * TODO alphabetical on keys
 * NB as product it's x ** y ** z etc. ordered example (2 ** 2 = 4):
 *   { a: false, b: false }
 *   { a: false, b: true  }
 *   { a: true,  b: false }
 *   { a: true,  b: true  }
 */
export const getEnum = <A>(enums: Enums<A>): Enum<A> => {
  const ks = pipe(
    Object.keys(enums) as Array<keyof A>,
    A.sort<keyof A>(StrCoerceOrd),
  )

  const f =
    (f: <B>(x: Enum<B>) => (y: B) => Option<B>) =>
    (x: A): Option<A> => {
      // TODO TODO TODO TODO consider restarting and piggybacking on Tuple. could
      // nested tuples work?
      // TODO TODO TODO this is where it's going wrong. currently does each key one by one and never goes backwards to go forwards. this mightn't be easy... have a bad feeling will need to calc the inverse of `calcEnumIndex` to get necessary indices of each piece back maybe... FML
      // eslint-disable-next-line functional/no-loop-statements
      for (const k of ks) {
        const my = f(enums[k])(x[k])
        // eslint-disable-next-line functional/no-conditional-statements
        if (O.isSome(my)) {
          console.log("getEnum f Some", k, my.value)
          return O.some({
            ...x,
            [k]: my.value,
          })
        }
      }

      console.log("getEnum f None")
      return O.none
    }

  const B = getBounded(enums)

  return {
    ...B,
    succ: f(E => E.succ),
    pred: f(E => E.pred),
    // TODO better perf some other way?
    toEnum: i => {
      // eslint-disable-next-line functional/no-conditional-statements
      if (i < 0) return O.none
      // TODO lol this is getting gnarly
      // eslint-disable-next-line functional/no-let
      let v = O.some(B.bottom)
      // eslint-disable-next-line functional/no-loop-statements, functional/no-let
      for (let j = 0; j < i; j++) {
        // eslint-disable-next-line functional/no-expression-statements
        v = O.chain(f(E => E.succ))(v)
      }
      return v
    },
    // 2 ** 3 = 8
    // so it's binary on the right. 000 = 0, 101 = 5, etc
    //   binary is base-2. the base/radix must change for the cardinality I guess?
    // { a: false, b: false, c: false } 0 ** 0 ** 0 = 0
    // { a: false, b: false, c: true  } 0 ** 0 ** 0 = 1
    // { a: false, b: true,  c: false } 0 ** 0 ** 0 = 2
    // { a: false, b: true,  c: true  } 0 ** 0 ** 0 = 3
    // { a: true,  b: false, c: false } 0 ** 0 ** 0 = 4
    // { a: true,  b: false, c: true  } 0 ** 0 ** 0 = 5
    // { a: true,  b: true,  c: false } 0 ** 0 ** 0 = 6
    // { a: true,  b: true,  c: true  } 0 ** 0 ** 0 = 7
    //
    // for 0 | 1 | 2 (3 ** 3 = 27) (radix 3 e.g.
    //   `parseInt('210', 3) = 21`
    //   `(2 * (3 ** 2)) + (1 * (3 ** 1)) + (0 * (3 ** 0))`
    // ):
    // (0, 0, 0) = 0
    // (0, 0, 1) = 1
    // (0, 0, 2) = 2
    // (0, 1, 0) = 3
    // (0, 1, 1) = 4
    // (0, 1, 2) = 5
    // (0, 2, 0) = 6
    // (0, 2, 1) = 7
    // (0, 2, 2) = 8
    // (1, 0, 0) = 9
    // (1, 0, 1) = 10
    // (1, 0, 2) = 11
    // (1, 1, 0) = 12
    // (1, 1, 1) = 13
    // (1, 1, 2) = 14
    // (1, 2, 0) = 15
    // (1, 2, 1) = 16
    // (1, 2, 2) = 17
    // (2, 0, 0) = 18
    // (2, 0, 1) = 19
    // (2, 0, 2) = 20
    // (2, 1, 0) = 21
    // (2, 1, 1) = 22
    // (2, 1, 2) = 23
    // (2, 2, 0) = 24
    // (2, 2, 1) = 25
    // (2, 2, 2) = 26
    //
    // radix is cardinality of each member of product. if they're not all the same
    // we can use the largest and still get a good ordering, but it won't be the index:
    //
    // for `(0 | 1 | 2) * (0 | 1)` (3 ** 2 = 6) (radix 3):
    // (0, 0) = 0
    // (0, 1) = 1
    // (1, 0) = 3
    // (1, 1) = 4
    // (2, 0) = 6
    // (2, 1) = 7
    //
    // so it skipped 2 and 5... I figure we could hack the maths for cardinality
    // per-member but that's gnarly. the radix alone is so elegant...
    //   (2, 0) should equal 4. 6 - (2 * (3 - 2)) (two iterations around the second)
    //   (2 * (3 ** 1)) + (0 * (2 ** 0)) = 6
    //   {2, 0} * {3, 2} = {6, 0} = 6 (https://demonstrations.wolfram.com/MixedRadixNumberRepresentations/)
    //
    // it should be possible... http://www.opimedia.be/mixed-radix/?radix-remain=2&radix-1=3&radix-0=2&length-1=3&length-0=2&general=0:3:2&disable=all,right,01,1,0
    //
    // given cardinalities/radices (2, 3, 14, 2) and values (1, 2, 12, 0), answer should be 164:
    //   ((0 * 1) + (((2 * 1) + (1 * (14 * 1))) * (2 ** 2)) + ((2 * 1) * (2 ** 2)) + ((1 * 1) * (2 ** 2))) * (14 ** 3) = ?
    //
    // algo: ?
    //
    fromEnum: x =>
      pipe(
        ks,
        A.map((k): [number, number] => {
          const E = enums[k]
          return [E.fromEnum(x[k]), L.execute(E.cardinality)]
        }),
        fromProductEnumFormula,
      ),
    cardinality: pipe(
      ks,
      L.traverseArray(k => enums[k].cardinality),
      L.map(concatAll(Num.MonoidSum)),
    ),
  }
}
