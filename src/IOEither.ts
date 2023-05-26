/**
 * Utility functions to accommodate `fp-ts/IOEither`.
 *
 * @since 0.15.0
 */

import { IOEither } from "fp-ts/IOEither"
import * as IOE from "fp-ts/IOEither"
import * as IO from "fp-ts/IO"
import { execute as executeIO } from "./IO"
import {
  unsafeUnwrap as unsafeUnwrapE,
  unsafeUnwrapLeft as unsafeUnwrapLeftE,
} from "./Either"
import { constVoid, flow } from "fp-ts/function"
import { Show } from "fp-ts/Show"

/**
 * Unwrap the value from within an `IOEither`, throwing with the inner value of
 * `Left` if `Left`.
 *
 * @example
 * import { unsafeUnwrap } from 'fp-ts-std/IOEither'
 * import * as IOE from 'fp-ts/IOEither'
 *
 * assert.strictEqual(unsafeUnwrap(IOE.right(5)), 5)
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const unsafeUnwrap: <A>(x: IOEither<unknown, A>) => A = flow(
  IO.map(unsafeUnwrapE),
  executeIO,
)

/**
 * Unwrap the value from within an `IOEither`, throwing the inner value of
 * `Right` if `Right`.
 *
 * @example
 * import { unsafeUnwrapLeft } from 'fp-ts-std/IOEither'
 * import * as IOE from 'fp-ts/IOEither'
 *
 * assert.strictEqual(unsafeUnwrapLeft(IOE.left(5)), 5)
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const unsafeUnwrapLeft: <E>(x: IOEither<E, unknown>) => E = flow(
  IO.map(unsafeUnwrapLeftE),
  executeIO,
)

/**
 * Unwrap the value from within an `IOEither`, throwing the inner value of
 * `Left` via `Show` if `Left`.
 *
 * @example
 * import { unsafeExpect } from 'fp-ts-std/IOEither'
 * import * as IOE from 'fp-ts/IOEither'
 * import * as Str from 'fp-ts/string'
 *
 * assert.throws(
 *   () => unsafeExpect(Str.Show)(IOE.left('foo')),
 *   /^"foo"$/,
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const unsafeExpect = <E>(S: Show<E>): (<A>(x: IOEither<E, A>) => A) =>
  flow(IOE.mapLeft(S.show), unsafeUnwrap)

/**
 * Unwrap the value from within an `IOEither`, throwing the inner value of
 * `Right` via `Show` if `Right`.
 *
 * @example
 * import { unsafeExpectLeft } from 'fp-ts-std/IOEither'
 * import * as IOE from 'fp-ts/IOEither'
 * import * as Str from 'fp-ts/string'
 *
 * assert.throws(
 *   () => unsafeExpectLeft(Str.Show)(IOE.right('foo')),
 *   /^"foo"$/,
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const unsafeExpectLeft = <A>(
  S: Show<A>,
): (<E>(x: IOEither<E, A>) => E) => flow(IOE.map(S.show), unsafeUnwrapLeft)

/**
 * Sequence an array of fallible effects, ignoring the results.
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export const sequenceArray_: <E, A>(
  xs: ReadonlyArray<IOEither<E, A>>,
) => IOEither<E, void> = flow(IOE.sequenceArray, IOE.map(constVoid))

/**
 * Map to and sequence an array of fallible effects, ignoring the results.
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export const traverseArray_: <E, A, B>(
  f: (x: A) => IOEither<E, B>,
) => (xs: ReadonlyArray<A>) => IOEither<E, void> = f =>
  flow(IOE.traverseArray(f), IOE.map(constVoid))
