import type { Either } from "fp-ts/Either"
import type * as RTE from "fp-ts/ReaderTaskEither"
import type { Task } from "fp-ts/Task"
import * as TE from "fp-ts/TaskEither"
import type { TaskEither } from "fp-ts/TaskEither"
/**
 * Utility functions to accommodate `fp-ts/ReaderTaskEither`.
 *
 * @since 0.15.0
 */
import { flow, identity } from "fp-ts/function"
import { runReader } from "./Reader"
import {
	unsafeUnwrapLeft as unsafeUnwrapLeftTE,
	unsafeUnwrap as unsafeUnwrapTE,
} from "./TaskEither"

/**
 * Runs a ReaderTaskEither and extracts the final TaskEither from it.
 *
 * @example
 * import { runReaderTaskEither } from 'fp-ts-std/ReaderTaskEither'
 * import { pipe } from "fp-ts/function"
 * import * as RTE from "fp-ts/ReaderTaskEither"
 * import * as E from "fp-ts/Either"
 *
 * type Env = { dependency: string }
 * const env: Env = { dependency: "dependency" }
 * pipe(
 *  E.right(1),
 *  RTE.fromEither,
 *  runReaderTaskEither(env)
 * )().then(extractedValue => assert.deepStrictEqual(extractedValue, E.right(1)))
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const runReaderTaskEither: <R, E, A>(
	r: R,
) => (reader: RTE.ReaderTaskEither<R, E, A>) => TaskEither<E, A> = runReader

/**
 * Unwrap the promise from within a `ReaderTaskEither`, rejecting with the inner
 * value of `Left` if `Left`.
 *
 * @example
 * import { unsafeUnwrap } from 'fp-ts-std/ReaderTaskEither'
 * import * as RTE from 'fp-ts/ReaderTaskEither'
 *
 * unsafeUnwrap(RTE.right(5))({}).then((x) => {
 *   assert.strictEqual(x, 5)
 * })
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const unsafeUnwrap =
	<R, A>(rte: RTE.ReaderTaskEither<R, unknown, A>) =>
	(r: R): Promise<A> =>
		unsafeUnwrapTE(rte(r))

/**
 * Unwrap the promise from within a `ReaderTaskEither`, throwing the inner
 * value of `Right` if `Right`.
 *
 * @example
 * import { unsafeUnwrapLeft } from 'fp-ts-std/ReaderTaskEither'
 * import * as RTE from 'fp-ts/ReaderTaskEither'
 *
 * unsafeUnwrapLeft(RTE.left(5))({}).then((x) => {
 *   assert.strictEqual(x, 5)
 * })
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const unsafeUnwrapLeft =
	<R, E>(rte: RTE.ReaderTaskEither<R, E, unknown>) =>
	(r: R): Promise<E> =>
		unsafeUnwrapLeftTE(rte(r))

/**
 * Effectfully accesses the environment outside of the `Reader` and `Task`
 * layers.
 *
 * @example
 * import { asksEither } from 'fp-ts-std/ReaderTaskEither'
 * import * as E from 'fp-ts/Either'
 *
 * const lucky = asksEither<number, unknown, boolean>(n => E.right(n === Date.now()))
 *
 * assert.deepEqual(
 *   lucky(42)(),
 *   Promise.resolve(E.right(false)),
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const asksEither = <R, E, A>(
	f: (r: R) => Either<E, A>,
): RTE.ReaderTaskEither<R, E, A> => flow(f, TE.fromEither)

/**
 * Effectfully accesses the environment outside of the `Reader` and `Either`
 * layers.
 *
 * @example
 * import { asksTask } from 'fp-ts-std/ReaderTaskEither'
 * import * as E from 'fp-ts/Either'
 *
 * const lucky = asksTask<number, unknown, boolean>(n => () => Promise.resolve(n === Date.now()))
 *
 * assert.deepEqual(
 *   lucky(42)(),
 *   Promise.resolve(E.right(false)),
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const asksTask = <R, E, A>(
	f: (r: R) => Task<A>,
): RTE.ReaderTaskEither<R, E, A> => flow(f, TE.fromTask)

/**
 * Effectfully accesses the environment outside of the `Reader` layer.
 *
 * @example
 * import { asksTaskEither } from 'fp-ts-std/ReaderTaskEither'
 * import * as E from 'fp-ts/Either'
 *
 * const lucky = asksTaskEither<number, unknown, boolean>(n => () => Promise.resolve(E.right(n === Date.now())))
 *
 * assert.deepEqual(
 *   lucky(42)(),
 *   Promise.resolve(E.right(false)),
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const asksTaskEither: <R, E, A>(
	f: (r: R) => TaskEither<E, A>,
) => RTE.ReaderTaskEither<R, E, A> = identity
