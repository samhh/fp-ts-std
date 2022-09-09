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
import { mapBoth as _mapBoth } from "./Bifunctor"

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
 * @since 0.15.0
 */
export const unsafeUnwrapLeft: <E>(x: IOEither<E, unknown>) => E = flow(
  IO.map(unsafeUnwrapLeftE),
  executeIO,
)

/**
 * Apply a function to both elements of an `IOEither`.
 *
 * @example
 * import * as IOE from 'fp-ts/IOEither'
 * import * as E from 'fp-ts/Either'
 * import { mapBoth } from 'fp-ts-std/IOEither'
 * import { multiply } from 'fp-ts-std/Number'
 *
 * const f = mapBoth(multiply(2))
 *
 * assert.deepStrictEqual(f(IOE.left(3))(), E.left(6))
 * assert.deepStrictEqual(f(IOE.right(3))(), E.right(6))
 *
 * @since 0.15.0
 */
export const mapBoth: <A, B>(
  f: (x: A) => B,
) => (xs: IOEither<A, A>) => IOEither<B, B> = _mapBoth(IOE.Bifunctor)

/**
 * Sequence an array of fallible effects, ignoring the results.
 *
 * @since 0.15.0
 */
export const sequenceArray_: <E, A>(
  xs: ReadonlyArray<IOEither<E, A>>,
) => IOEither<E, void> = flow(IOE.sequenceArray, IOE.map(constVoid))

/**
 * Map to and sequence an array of fallible effects, ignoring the results.
 *
 * @since 0.15.0
 */
export const traverseArray_: <E, A, B>(
  f: (x: A) => IOEither<E, B>,
) => (xs: ReadonlyArray<A>) => IOEither<E, void> = f =>
  flow(IOE.traverseArray(f), IOE.map(constVoid))
