/**
 * Utility functions to accommodate `fp-ts/ReaderEither`.
 *
 * @since 0.15.0
 */
import { ReaderEither } from "fp-ts/ReaderEither"
import { Either } from "fp-ts/Either"
import { runReader } from "./Reader"

/**
 * Runs a ReaderEither and extracts the final Either from it.
 *
 * @example
 * import { runReaderEither } from 'fp-ts-std/ReaderEither'
 * import { pipe } from "fp-ts/function"
 * import * as RE from "fp-ts/ReaderEither"
 * import * as E from "fp-ts/Either"
 *
 * type Env = { dependency: string }
 * const env: Env = { dependency: "dependency" }
 *
 * const extractedEither = pipe(
 *  E.right(1),
 *  RE.fromEither,
 *  runReaderEither(env)
 * )
 *
 * assert.deepStrictEqual(extractedEither, E.right(1))
 *
 *
 * @since 0.15.0
 */
export const runReaderEither: <R, E, A>(
  r: R,
) => (reader: ReaderEither<R, E, A>) => Either<E, A> = runReader
