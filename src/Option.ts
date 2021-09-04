/**
 * Utility functions to accommodate `fp-ts/Option`.
 *
 * @since 0.1.0
 */

import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"

/**
 * Unwrap the value from within an `Option`, throwing if `None`.
 *
 * @example
 * import { unsafeUnwrap } from 'fp-ts-std/Option';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(unsafeUnwrap(O.some(5)), 5);
 *
 * @since 0.1.0
 */
export const unsafeUnwrap = <A>(x: Option<A>): A => {
  // eslint-disable-next-line functional/no-conditional-statement, functional/no-throw-statement
  if (O.isNone(x)) throw "Unsafe attempt to unwrap Option failed"

  return x.value
}

/**
 * A thunked `None` constructor. Enables specifying the type of the `Option`
 * without a type assertion. Helpful in certain circumstances in which type
 * inferrence isn't smart enough to unify with the `Option<never>` of the
 * standard `None` constructor.
 *
 * @example
 * import { noneAs } from 'fp-ts-std/Option';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(noneAs<any>(), O.none);
 *
 * @since 0.12.0
 */
export const noneAs = <A>(): Option<A> => O.none
