/**
 * Utility functions to accommodate `fp-ts/Either`.
 *
 * @since 0.1.0
 */

import { Either } from "fp-ts/Either"
import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import { mapBoth as _mapBoth } from "./Bifunctor"
import { Show } from "fp-ts/Show"
import { constant, flow, pipe } from "fp-ts/function"
import * as L from "./Lazy"
import { Ord } from "fp-ts/Ord"
import { Bounded } from "fp-ts/Bounded"
import { Enum } from "./Enum"
import { add } from "./Number"
import { curry2 } from "./Function"
import { Ordering } from "fp-ts/Ordering"
import { LT, GT } from "./Ordering"

/**
 * Unwrap the value from within an `Either`, throwing the inner value of `Left`
 * if `Left`.
 *
 * @example
 * import { unsafeUnwrap } from 'fp-ts-std/Either'
 * import * as E from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(unsafeUnwrap(E.right(5)), 5)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const unsafeUnwrap = <A>(x: Either<unknown, A>): A => {
  // eslint-disable-next-line functional/no-conditional-statements, functional/no-throw-statements
  if (E.isLeft(x)) throw x.left

  return x.right
}

/**
 * Unwrap the value from within an `Either`, throwing the inner value of `Right`
 * if `Right`.
 *
 * @example
 * import { unsafeUnwrapLeft } from 'fp-ts-std/Either'
 * import * as E from 'fp-ts/Either'
 *
 * assert.deepStrictEqual(unsafeUnwrapLeft(E.left(5)), 5)
 *
 * @category 3 Functions
 * @since 0.5.0
 */
export const unsafeUnwrapLeft = <E>(x: Either<E, unknown>): E => {
  // eslint-disable-next-line functional/no-conditional-statements, functional/no-throw-statements
  if (E.isRight(x)) throw x.right

  return x.left
}

/**
 * Unwrap the value from within an `Either`, throwing the inner value of `Left`
 * via `Show` if `Left`.
 *
 * @example
 * import { unsafeExpect } from 'fp-ts-std/Either'
 * import * as E from 'fp-ts/Either'
 * import * as Str from 'fp-ts/string'
 *
 * assert.throws(
 *   () => unsafeExpect(Str.Show)(E.left('foo')),
 *   /^"foo"$/,
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const unsafeExpect = <E>(S: Show<E>): (<A>(x: Either<E, A>) => A) =>
  flow(E.mapLeft(S.show), unsafeUnwrap)

/**
 * Unwrap the value from within an `Either`, throwing the inner value of `Right`
 * via `Show` if `Right`.
 *
 * @example
 * import { unsafeExpectLeft } from 'fp-ts-std/Either'
 * import * as E from 'fp-ts/Either'
 * import * as Str from 'fp-ts/string'
 *
 * assert.throws(
 *   () => unsafeExpectLeft(Str.Show)(E.right('foo')),
 *   /^"foo"$/,
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const unsafeExpectLeft = <A>(S: Show<A>): (<E>(x: Either<E, A>) => E) =>
  flow(E.map(S.show), unsafeUnwrapLeft)

/**
 * Apply a function to both elements of an `Either`.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { mapBoth } from 'fp-ts-std/Either'
 * import { multiply } from 'fp-ts-std/Number'
 *
 * const f = mapBoth(multiply(2))
 *
 * assert.deepStrictEqual(f(E.left(3)), E.left(6))
 * assert.deepStrictEqual(f(E.right(3)), E.right(6))
 *
 * @category 2 Typeclass Methods
 * @since 0.14.0
 */
export const mapBoth: <A, B>(
  f: (x: A) => B,
) => (xs: Either<A, A>) => Either<B, B> = _mapBoth(E.Bifunctor)

/**
 * Pattern match against two `Either`s simultaneously.
 *
 * @example
 * import { withFst } from 'fp-ts-std/Tuple'
 * import * as E from 'fp-ts/Either'
 * import Either = E.Either
 * import { match2 } from 'fp-ts-std/Either'
 *
 * const pair: (x: string) => (y: string) => [string, string] = withFst
 *
 * const f: (x: Either<string, string>) => (y: Either<string, string>) => [string, string] =
 *   match2(pair, pair, pair, pair)
 *
 * assert.deepStrictEqual(f(E.left('l'))(E.left('l')), ['l', 'l'])
 * assert.deepStrictEqual(f(E.left('l'))(E.right('r')), ['l', 'r'])
 * assert.deepStrictEqual(f(E.left('r'))(E.right('l')), ['r', 'l'])
 * assert.deepStrictEqual(f(E.left('r'))(E.right('r')), ['r', 'r'])
 *
 * @category 3 Functions
 * @since 0.17.0
 */
/* eslint-disable functional/prefer-tacit */
export const match2 =
  <A, B, C, D, E>(
    onLeftLeft: (x: A) => (y: C) => E,
    onLeftRight: (x: A) => (y: D) => E,
    onRightLeft: (x: B) => (y: C) => E,
    onRightRight: (x: B) => (y: D) => E,
  ) =>
  (mab: Either<A, B>) =>
  (mcd: Either<C, D>): E =>
    pipe(
      mab,
      E.match(
        a =>
          pipe(
            mcd,
            E.match(
              c => onLeftLeft(a)(c),
              d => onLeftRight(a)(d),
            ),
          ),
        b =>
          pipe(
            mcd,
            E.match(
              c => onRightLeft(b)(c),
              d => onRightRight(b)(d),
            ),
          ),
      ),
    )
/* eslint-enable functional/prefer-tacit */

/**
 * Derive an `Ord` instance for `Either<E, A>` in which `Left` values are
 * considered less than `Right` values.
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import { getOrd } from 'fp-ts-std/Either'
 * import * as Num from 'fp-ts/number'
 * import { LT, EQ, GT } from 'fp-ts-std/Ordering'
 *
 * const O = getOrd(Num.Ord)(Num.Ord)
 *
 * assert.strictEqual(O.compare(E.left(1), E.left(1)), EQ)
 * assert.strictEqual(O.compare(E.left(1), E.left(2)), LT)
 * assert.strictEqual(O.compare(E.right(1), E.left(2)), GT)
 *
 * @category 1 Typeclass Instances
 * @since 0.17.0
 */
export const getOrd =
  <E>(EO: Ord<E>) =>
  <A>(AO: Ord<A>): Ord<Either<E, A>> => ({
    ...E.getEq(EO, AO),
    compare: (x, y) =>
      match2<E, A, E, A, Ordering>(
        curry2(EO.compare),
        constant(constant(LT)),
        constant(constant(GT)),
        curry2(AO.compare),
      )(x)(y),
  })

/**
 * Derive a `Bounded` instance for `Either<E, A>` in which the top and bottom
 * bounds are `Right(A.top)` and `Left(E.bottom)` respectively.
 *
 * @category 1 Typeclass Instances
 * @since 0.17.0
 */
export const getBounded =
  <E>(BE: Bounded<E>) =>
  <A>(BA: Bounded<A>): Bounded<Either<E, A>> => ({
    ...getOrd(BE)(BA),
    top: E.right(BA.top),
    bottom: E.left(BE.bottom),
  })

/**
 * Derive an `Enum` instance for `Either<E, A>` given an `Enum` instance for `E`
 * and `A`.
 *
 * @example
 * import { universe } from 'fp-ts-std/Enum'
 * import { Enum as EnumBool } from 'fp-ts-std/Boolean'
 * import * as E from 'fp-ts/Either'
 * import { getEnum as getEnumE } from 'fp-ts-std/Either'
 *
 * const EnumBoolE = getEnumE(EnumBool)(EnumBool)
 *
 * assert.deepStrictEqual(
 *   universe(EnumBoolE),
 *   [E.left(false), E.left(true), E.right(false), E.right(true)],
 * )
 *
 * @category 1 Typeclass Instances
 * @since 0.17.0
 */
export const getEnum =
  <E>(EE: Enum<E>) =>
  <A>(EA: Enum<A>): Enum<Either<E, A>> => ({
    ...getBounded(EE)(EA),
    succ: E.match(
      flow(
        EE.succ,
        O.matchW(
          L.lazy(() => E.right(EA.bottom)),
          E.left,
        ),
        O.some,
      ),
      flow(EA.succ, O.map(E.right)),
    ),
    pred: E.match(
      flow(EE.pred, O.map(E.left)),
      flow(
        EA.pred,
        O.matchW(
          L.lazy(() => E.left(EE.top)),
          E.right,
        ),
        O.some,
      ),
    ),
    toEnum: n => {
      const ec = L.execute(EE.cardinality)
      return n < ec
        ? pipe(n, EE.toEnum, O.map(E.left))
        : pipe(n - ec, EA.toEnum, O.map(E.right))
    },
    fromEnum: E.match(
      EE.fromEnum,
      flow(EA.fromEnum, n => n + L.execute(EE.cardinality)),
    ),
    cardinality: pipe(L.of(add), L.ap(EE.cardinality), L.ap(EA.cardinality)),
  })
