/**
 * Utility functions to accommodate `fp-ts/TaskEither`.
 *
 * @since 0.12.0
 */

import { TaskEither } from "fp-ts/TaskEither"
import * as TE from "fp-ts/TaskEither"
import * as T from "fp-ts/Task"
import { execute as executeT } from "./Task"
import {
	unsafeUnwrap as unsafeUnwrapE,
	unsafeUnwrapLeft as unsafeUnwrapLeftE,
} from "./Either"
import { constVoid, flow } from "fp-ts/function"
import { Show } from "fp-ts/Show"
import { pass as _pass } from "./Applicative"

/**
 * Unwrap the promise from within a `TaskEither`, rejecting with the inner
 * value of `Left` if `Left`.
 *
 * @example
 * import { unsafeUnwrap } from 'fp-ts-std/TaskEither'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * unsafeUnwrap(TE.right(5)).then((x) => {
 *   assert.strictEqual(x, 5)
 * })
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const unsafeUnwrap: <A>(x: TaskEither<unknown, A>) => Promise<A> = flow(
	T.map(unsafeUnwrapE),
	executeT,
)

/**
 * Unwrap the promise from within a `TaskEither`, throwing the inner value of
 * `Right` if `Right`.
 *
 * @example
 * import { unsafeUnwrapLeft } from 'fp-ts-std/TaskEither'
 * import * as TE from 'fp-ts/TaskEither'
 *
 * unsafeUnwrapLeft(TE.left(5)).then((x) => {
 *   assert.strictEqual(x, 5)
 * })
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const unsafeUnwrapLeft: <E>(x: TaskEither<E, unknown>) => Promise<E> =
	flow(T.map(unsafeUnwrapLeftE), executeT)

/**
 * Unwrap the promise from within a `TaskEither`, rejecting with the inner
 * value of `Left` via `Show` if `Left`.
 *
 * @example
 * import { unsafeExpect } from 'fp-ts-std/TaskEither'
 * import * as TE from 'fp-ts/TaskEither'
 * import * as Str from 'fp-ts/string'
 *
 * assert.rejects(
 *   unsafeExpect(Str.Show)(TE.left('foo')),
 *   Error('Unwrapped `Left`', { cause: 'foo' }),
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const unsafeExpect = <E>(
	S: Show<E>,
): (<A>(x: TaskEither<E, A>) => Promise<A>) =>
	flow(TE.mapLeft(S.show), unsafeUnwrap)

/**
 * Unwrap the promise from within a `TaskEither`, rejecting with the inner
 * value of `Right` via `Show` if `Right`.
 *
 * @example
 * import { unsafeExpectLeft } from 'fp-ts-std/TaskEither'
 * import * as TE from 'fp-ts/TaskEither'
 * import * as Str from 'fp-ts/string'
 *
 * assert.rejects(
 *   unsafeExpectLeft(Str.Show)(TE.right('foo')),
 *   Error('Unwrapped `Right`', { cause: '"foo"' }),
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const unsafeExpectLeft = <A>(
	S: Show<A>,
): (<E>(x: TaskEither<E, A>) => Promise<E>) =>
	flow(TE.map(S.show), unsafeUnwrapLeft)

/**
 * Sequence an array of fallible tasks, ignoring the results.
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export const sequenceArray_: <E, A>(
	xs: ReadonlyArray<TaskEither<E, A>>,
) => TaskEither<E, void> = flow(TE.sequenceArray, TE.map(constVoid))

/**
 * Sequentially sequence an array of fallible tasks, ignoring the results.
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export const sequenceSeqArray_: <E, A>(
	xs: ReadonlyArray<TaskEither<E, A>>,
) => TaskEither<E, void> = flow(TE.sequenceSeqArray, TE.map(constVoid))

/**
 * Map to and sequence an array of fallible tasks, ignoring the results.
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export const traverseArray_: <E, A, B>(
	f: (x: A) => TaskEither<E, B>,
) => (xs: ReadonlyArray<A>) => TaskEither<E, void> = f =>
	flow(TE.traverseArray(f), TE.map(constVoid))

/**
 * Sequentially map to and sequence an array of fallible tasks, ignoring the
 * results.
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export const traverseSeqArray_: <E, A, B>(
	f: (x: A) => TaskEither<E, B>,
) => (xs: ReadonlyArray<A>) => TaskEither<E, void> = f =>
	flow(TE.traverseSeqArray(f), TE.map(constVoid))

/**
 * Convenient alias for `TE.of(undefined)`.
 *
 * @example
 * import { flow, pipe, constant } from 'fp-ts/function'
 * import * as Fn from 'fp-ts-std/Function'
 * import * as O from 'fp-ts/Option'
 * import Option = O.Option
 * import * as TE from 'fp-ts/TaskEither'
 * import TaskEither = TE.TaskEither
 * import { pass } from 'fp-ts-std/TaskEither'
 * import { log } from 'fp-ts/Console'
 *
 * const mcount: Option<number> = O.some(123)
 * const tryAsyncLog: <A>(x: A) => TaskEither<void, void> = flow(log, TE.fromIO)
 *
 * const logCount: TaskEither<void, void> = pipe(
 *   mcount,
 *   O.match(
 *     constant(pass),
 *     tryAsyncLog,
 *   ),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export const pass: TaskEither<never, void> = _pass(TE.ApplicativePar)
