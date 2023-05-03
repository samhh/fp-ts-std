/**
 * Utility functions to accommodate `fp-ts/Either`.
 *
 * @since 0.1.0
 */

import { Either } from "fp-ts/Either"
import * as E from "fp-ts/Either"
import { mapBoth as _mapBoth } from "./Bifunctor"
import { Show } from "fp-ts/Show"
import { flow, pipe } from "fp-ts/function"

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
