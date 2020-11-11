/**
 * @since 0.1.0
 */

import { Either } from "fp-ts/Either"
import * as E from "fp-ts/Either"

/**
 * Unwrap the value from within an `Either`, throwing if `Left`.
 *
 * @example
 * import { unsafeUnwrap } from 'fp-ts-std/Either';
 * import * as E from 'fp-ts/Either';
 *
 * assert.deepStrictEqual(unsafeUnwrap(E.right(5)), 5);
 *
 * @since 0.1.0
 */
export const unsafeUnwrap = <A>(x: Either<unknown, A>): A => {
  // eslint-disable-next-line functional/no-conditional-statement, functional/no-throw-statement
  if (E.isLeft(x)) throw "Unsafe attempt to unwrap Either failed"

  return x.right
}

/**
 * Unwrap the value from within an `Either`, throwing if `Right`.
 *
 * @example
 * import { unsafeUnwrapLeft } from 'fp-ts-std/Either';
 * import * as E from 'fp-ts/Either';
 *
 * assert.deepStrictEqual(unsafeUnwrapLeft(E.left(5)), 5);
 *
 * @since 0.5.0
 */
export const unsafeUnwrapLeft = <E>(x: Either<E, unknown>): E => {
  // eslint-disable-next-line functional/no-conditional-statement, functional/no-throw-statement
  if (E.isRight(x)) throw "Unsafe attempt to unwrap Either failed"

  return x.left
}
