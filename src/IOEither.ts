/**
 * Utility functions to accommodate `fp-ts/IOEither`.
 *
 * @since 0.15.0
 */

import * as IO from "fp-ts/IO"
import { IOEither } from "fp-ts/IOEither"
import * as IOE from "fp-ts/IOEither"
import { Show } from "fp-ts/Show"
import { constVoid, flow } from "fp-ts/function"
import { pass as _pass } from "./Applicative"
import {
	unsafeUnwrap as unsafeUnwrapE,
	unsafeUnwrapLeft as unsafeUnwrapLeftE,
} from "./Either"
import { execute as executeIO } from "./IO"

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
 *   Error('Unwrapped `Left`', { cause: '"foo"' }),
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
 *   Error('Unwrapped `Right`', { cause: '"foo"' }),
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

/**
 * Convenient alias for `IOE.of(undefined)`.
 *
 * @example
 * import { flow, pipe, constant } from 'fp-ts/function'
 * import * as Fn from 'fp-ts-std/Function'
 * import * as O from 'fp-ts/Option'
 * import Option = O.Option
 * import * as IOE from 'fp-ts/IOEither'
 * import IOEither = IOE.IOEither
 * import { pass } from 'fp-ts-std/IOEither'
 * import { log } from 'fp-ts/Console'
 *
 * const mcount: Option<number> = O.some(123)
 * const tryLog: <A>(x: A) => IOEither<void, void> = flow(log, IOE.fromIO)
 *
 * const logCount: IOEither<void, void> = pipe(
 *   mcount,
 *   O.match(
 *     constant(pass),
 *     tryLog,
 *   ),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export const pass: IOEither<never, void> = _pass(IOE.ApplicativePar)
