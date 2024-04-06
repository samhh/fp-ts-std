import type { IO } from "fp-ts/IO"
/**
 * Utility functions to accommodate `fp-ts/ReaderIO`.
 *
 * @since 0.16.0
 */
import type { ReaderIO } from "fp-ts/ReaderIO"
import { identity } from "fp-ts/function"
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
