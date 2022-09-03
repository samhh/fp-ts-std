/**
 * Polymorphic functions for `newtype-ts`.
 *
 * **Warning**: These functions will allow you to break the contracts of
 * newtypes behind smart constructors.
 *
 * @since 0.15.0
 */

import { Newtype, iso } from "newtype-ts"
import { Endomorphism } from "fp-ts/Endomorphism"

/**
 * Convert an endomorphism on the type beneath a newtype to an endomorphism on
 * the newtype itself.
 *
 * @example
 * import { over } from 'fp-ts-std/Newtype'
 * import { mkMilliseconds } from 'fp-ts-std/Date'
 * import { multiply } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(
 *   over(multiply(2))(mkMilliseconds(3)),
 *   mkMilliseconds(6),
 * )
 *
 * @since 0.15.0
 */
export const over =
  <A>(f: Endomorphism<A>) =>
  <B extends Newtype<unknown, A>>(x: B): B =>
    iso<B>().modify(f)(x)
