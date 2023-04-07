/**
 * Utility functions to accommodate `fp-ts/ReaderIO`.
 *
 * @since 0.16.0
 */
import { ReaderIO } from "fp-ts/ReaderIO"
import { IO } from "fp-ts/IO"
import { runReader } from "./Reader"

/**
 * Runs a `ReaderIO` and extracts the final `IO` from it.
 *
 * @example
 * import { runReaderIO } from 'fp-ts-std/ReaderIO'
 * import { pipe } from "fp-ts/function"
 * import * as RIO from "fp-ts/ReaderIO"
 *
 * assert.strictEqual(
 *   pipe(
 *     RIO.of<string, number>(123),
 *     runReaderIO("env"),
 *   )(),
 *   123,
 * )
 *
 *
 * @since 0.16.0
 */
export const runReaderIO: <R, A>(r: R) => (m: ReaderIO<R, A>) => IO<A> =
  runReader
