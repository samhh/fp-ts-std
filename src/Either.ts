/**
 * Utility functions to accommodate `fp-ts/Either`.
 *
 * @since 0.1.0
 */

import { Either } from "fp-ts/Either"
import * as E from "fp-ts/Either"
import { mapBoth as _mapBoth } from "./Bifunctor"

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
  // eslint-disable-next-line functional/no-conditional-statement, functional/no-throw-statement
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
  // eslint-disable-next-line functional/no-conditional-statement, functional/no-throw-statement
  if (E.isRight(x)) throw x.right

  return x.left
}

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
