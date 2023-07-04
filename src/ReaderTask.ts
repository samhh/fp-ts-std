/**
 * Utility functions to accommodate `fp-ts/ReaderTask`.
 *
 * @since 0.15.0
 */
import { identity } from "fp-ts/lib/function.js"
import { ReaderTask } from "fp-ts/lib/ReaderTask.js"
import { Task } from "fp-ts/lib/Task.js"
import { runReader } from "./Reader.js"

/**
 * Runs a ReaderTask and extracts the final Task from it.
 *
 * @example
 * import { runReaderTask } from 'fp-ts-std/ReaderTask'
 * import { pipe } from "fp-ts/lib/function.js"
 * import * as RT from "fp-ts/lib/ReaderTask.js"
 *
 * type Env = { dependency: string }
 * const env: Env = { dependency: "dependency " }
 * pipe(
 *  RT.of<Env, number>(1),
 *  runReaderTask(env)
 * )().then(extractedValue => assert.strictEqual(extractedValue, 1))
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const runReaderTask: <R, A>(
  r: R,
) => (reader: ReaderTask<R, A>) => Task<A> = runReader

/**
 * Effectfully accesses the environment outside of the `Reader` layer.
 *
 * @example
 * import { asksTask } from 'fp-ts-std/ReaderTask'
 *
 * const lucky = asksTask<number, boolean>(n => () => Promise.resolve(n === Date.now()))
 *
 * assert.deepEqual(
 *   lucky(42)(),
 *   Promise.resolve(false),
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const asksTask: <R, A>(f: (r: R) => Task<A>) => ReaderTask<R, A> =
  identity
