/**
 * Utility functions to accommodate `fp-ts/Task`.
 *
 * @since 0.1.0
 */

import * as T from "fp-ts/Task"
type Task<A> = T.Task<A>
import { Endomorphism } from "fp-ts/Endomorphism"
import { IO } from "fp-ts/IO"
import { Predicate } from "fp-ts/Predicate"
import { constVoid, flow } from "fp-ts/function"
import { pass as _pass, unless as _unless, when as _when } from "./Applicative"
import { Milliseconds, fieldMilliseconds, now, unMilliseconds } from "./Date"
import { until as _until } from "./Monad"

/**
 * Wait for the specified number of milliseconds before resolving.
 *
 * Like `fp-ts/Task::delay`, but doesn't run any underlying task; it simply
 * resolves with void. Can also be useful with async/await (`await sleep(n)()`).
 *
 * @example
 * import { sleep } from 'fp-ts-std/Task'
 * import { mkMilliseconds } from 'fp-ts-std/Date'
 * import { sequenceT } from 'fp-ts/Apply'
 * import { pipe } from 'fp-ts/function'
 * import { Task } from 'fp-ts/Task'
 * import * as T from 'fp-ts/Task'
 *
 * const xs: Array<string> = []
 *
 * const append = (msg: string): Task<void> => T.fromIO(() => {
 *     xs.push(msg)
 * })
 *
 * const instant = append('a')
 * const slowest = pipe(sleep(mkMilliseconds(10)), T.chain(() => append('b')))
 * const slow = pipe(sleep(mkMilliseconds(5)), T.chain(() => append('c')))
 *
 * sequenceT(T.ApplicativePar)(instant, slowest, slow)().then(() => {
 *     assert.deepStrictEqual(xs, ['a', 'c', 'b'])
 * })
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const sleep =
	(n: Milliseconds): Task<void> =>
	() =>
		new Promise<void>(resolve => {
			// eslint-disable-next-line functional/no-expression-statements
			setTimeout(resolve, Math.floor(unMilliseconds(n)))
		})

/**
 * Calls the callback upon task completion with the number of milliseconds it
 * took for the task to complete. The task otherwise operates as per usual.
 *
 * @example
 * import { elapsed, sleep } from 'fp-ts-std/Task'
 * import * as D from 'fp-ts-std/Date'
 * import { gt } from 'fp-ts/Ord'
 *
 * const wait = sleep(D.mkMilliseconds(10))
 * let time: D.Milliseconds
 * const waitAndTrackElapsed = elapsed((ms) => () => { time = ms })(wait)
 *
 * waitAndTrackElapsed().then(() => {
 *     assert.strictEqual(time !== undefined && gt(D.ordMilliseconds)(time, D.mkMilliseconds(0)), true)
 * })
 *
 * @category 3 Functions
 * @since 0.5.0
 */
export const elapsed =
	(f: (n: Milliseconds) => IO<void>) =>
	<A>(x: Task<A>): Task<A> =>
	async () => {
		const start = now()
		const y = await x()
		const duration = fieldMilliseconds.sub(now(), start)
		// eslint-disable-next-line functional/no-expression-statements
		f(duration)()

		return y
	}

/**
 * Execute a `Task`, returning the `Promise` within. Helpful for staying within
 * function application and composition pipelines.
 *
 * @example
 * import { execute } from 'fp-ts-std/Task'
 * import * as T from 'fp-ts/Task'
 *
 * execute(T.of(5)).then((x) => {
 *   assert.strictEqual(x, 5)
 * })
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const execute = <A>(x: Task<A>): Promise<A> => x()

/**
 * Conditional execution of a `Task`. Helpful for things like asychronous
 * logging.
 *
 * @example
 * import { flow, pipe } from 'fp-ts/function'
 * import { Predicate } from 'fp-ts/Predicate'
 * import { when } from 'fp-ts-std/Task'
 * import * as TE from 'fp-ts/TaskEither'
 * import * as T from 'fp-ts/Task'
 * import { log } from 'fp-ts/Console'
 *
 * const logAsync = flow(log, T.fromIO)
 * const isInvalid: Predicate<number> = n => n !== 42
 *
 * pipe(
 *   TE.of(123),
 *   TE.chainFirstTaskK(n =>
 *     when(isInvalid(n))(logAsync(n))),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const when: (x: boolean) => Endomorphism<Task<void>> = _when(
	T.ApplicativePar,
)

/**
 * The reverse of `when`.
 *
 * @example
 * import { flow, pipe } from 'fp-ts/function'
 * import { Predicate } from 'fp-ts/Predicate'
 * import { unless } from 'fp-ts-std/Task'
 * import * as TE from 'fp-ts/TaskEither'
 * import * as T from 'fp-ts/Task'
 * import { log } from 'fp-ts/Console'
 *
 * const logAsync = flow(log, T.fromIO)
 * const isValid: Predicate<number> = n => n === 42
 *
 * pipe(
 *   TE.of(123),
 *   TE.chainFirstTaskK(n =>
 *     unless(isValid(n))(logAsync(n))),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.12.0
 */
export const unless: (x: boolean) => Endomorphism<Task<void>> = _unless(
	T.ApplicativePar,
)

/**
 * Sequence an array of tasks, ignoring the results.
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export const sequenceArray_: <A>(xs: ReadonlyArray<Task<A>>) => Task<void> =
	flow(T.sequenceArray, T.map(constVoid))

/**
 * Sequentially sequence an array of tasks, ignoring the results.
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export const sequenceSeqArray_: <A>(xs: ReadonlyArray<Task<A>>) => Task<void> =
	flow(T.sequenceSeqArray, T.map(constVoid))

/**
 * Map to and sequence an array of tasks, ignoring the results.
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export const traverseArray_: <A, B>(
	f: (x: A) => Task<B>,
) => (xs: ReadonlyArray<A>) => Task<void> = f =>
	flow(T.traverseArray(f), T.map(constVoid))

/**
 * Sequentially map to and sequence an array of tasks, ignoring the results.
 *
 * @category 2 Typeclass Methods
 * @since 0.15.0
 */
export const traverseSeqArray_: <A, B>(
	f: (x: A) => Task<B>,
) => (xs: ReadonlyArray<A>) => Task<void> = f =>
	flow(T.traverseSeqArray(f), T.map(constVoid))

/**
 * Convenient alias for `T.of(undefined)`.
 *
 * @example
 * import { flow, pipe, constant } from 'fp-ts/function'
 * import * as T from 'fp-ts/Task'
 * import Task = T.Task
 * import { pass } from 'fp-ts-std/Task'
 * import * as O from 'fp-ts/Option'
 * import Option = O.Option
 * import { log } from 'fp-ts/Console'
 *
 * const mcount: Option<number> = O.some(123)
 * const asyncLog: <A>(x: A) => Task<void> = flow(log, T.fromIO)
 *
 * const logCount: Task<void> = pipe(
 *   mcount,
 *   O.match(
 *     constant(pass),
 *     asyncLog,
 *   ),
 * )
 *
 * @category 2 Typeclass Methods
 * @since 0.17.0
 */
export const pass: Task<void> = _pass(T.ApplicativePar)

/**
 * Repeatedly execute an asynchronous effect until the result satisfies the predicate.
 *
 * @example
 * import { until, execute } from 'fp-ts-std/Task'
 * import * as T from 'fp-ts/Task'
 * import Task = T.Task
 * import { Predicate } from 'fp-ts/Predicate'
 * import * as Rand from 'fp-ts/Random'
 *
 * const isValid: Predicate<number> = n => n > 0.5
 *
 * const genValidAsync: Task<number> = until(isValid)(T.fromIO(Rand.random))
 *
 * async function test() {
 *   assert.strictEqual(
 *     isValid(await execute(genValidAsync)),
 *     true,
 *   )
 * }
 *
 * test()
 *
 * @category 2 Typeclass Methods
 * @since 0.18.0
 */
export const until: <A>(p: Predicate<A>) => Endomorphism<Task<A>> = _until(
	T.Monad,
)
