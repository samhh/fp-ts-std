/**
 * Utility functions to accommodate `fp-ts/ReaderIO`.
 *
 * @since 0.16.0
 */
import { ReaderIO } from "fp-ts/lib/ReaderIO.js"
import { IO } from "fp-ts/lib/IO.js"
import { runReader } from "./Reader.js"
import { identity } from "fp-ts/lib/function.js"

/**
 * Runs a `ReaderIO` and extracts the final `IO` from it.
 *
 * @example
 * import { runReaderIO } from 'fp-ts-std/ReaderIO'
 * import { pipe } from "fp-ts/lib/function.js"
 * import * as RIO from "fp-ts/lib/ReaderIO.js"
 *
 * assert.strictEqual(
 *   pipe(
 *     RIO.of<string, number>(123),
 *     runReaderIO("env"),
 *   )(),
 *   123,
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const runReaderIO: <R, A>(r: R) => (m: ReaderIO<R, A>) => IO<A> =
  runReader

/**
 * Effectfully accesses the environment outside of the `Reader` layer.
 *
 * @example
 * import { asksIO } from 'fp-ts-std/ReaderIO'
 *
 * const lucky = asksIO<number, boolean>(n => () => n === Date.now())
 *
 * assert.strictEqual(
 *   lucky(42)(),
 *   false,
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const asksIO: <R, A>(f: (r: R) => IO<A>) => ReaderIO<R, A> = identity
