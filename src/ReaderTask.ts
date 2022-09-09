/**
 * Utility functions to accommodate `fp-ts/ReaderTask`.
 *
 * @since 0.15.0
 */
import { ReaderTask } from "fp-ts/ReaderTask"
import { Task } from "fp-ts/Task"
import { runReader } from "./Reader"

/**
 * Runs a ReaderTask and extracts the final Task from it.
 *
 * @example
 * import { runReaderTask } from 'fp-ts-std/ReaderTask'
 * import { pipe } from "fp-ts/function"
 * import * as RT from "fp-ts/ReaderTask"
 *
 * type Env = { dependency: string }
 * const env: Env = { dependency: "dependency " }
 * pipe(
 *  RT.of<Env, number>(1),
 *  runReaderTask(env)
 * )().then(extractedValue => assert.strictEqual(extractedValue, 1))
 *
 *
 * @since 0.15.0
 */
export const runReaderTask: <R, A>(
  r: R,
) => (reader: ReaderTask<R, A>) => Task<A> = runReader
