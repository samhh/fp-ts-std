/**
 * Utility functions to accommodate `fp-ts/ReaderEither`.
 *
 * @since 0.15.0
 */
import { ReaderEither } from "fp-ts/lib/ReaderEither.js"
import { Either } from "fp-ts/lib/Either.js"
import { runReader } from "./Reader.js"
import { identity } from "fp-ts/lib/function.js"

/**
 * Runs a ReaderEither and extracts the final Either from it.
 *
 * @example
 * import { runReaderEither } from 'fp-ts-std/ReaderEither'
 * import { pipe } from "fp-ts/lib/function.js"
 * import * as RE from "fp-ts/lib/ReaderEither.js"
 * import * as E from "fp-ts/lib/Either.js"
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
 * @category 3 Functions
 * @since 0.15.0
 */
export const runReaderEither: <R, E, A>(
  r: R,
) => (reader: ReaderEither<R, E, A>) => Either<E, A> = runReader

/**
 * Effectfully accesses the environment outside of the `Reader` layer.
 *
 * @example
 * import { asksEither } from 'fp-ts-std/ReaderEither'
 * import * as E from 'fp-ts/Either'
 *
 * const lucky = asksEither<number, unknown, boolean>(n => E.right(n === Date.now()))
 *
 * assert.deepStrictEqual(
 *   lucky(42),
 *   E.right(false),
 * )
 *
 * @category 3 Functions
 * @since 0.16.0
 */
export const asksEither: <R, E, A>(
  f: (r: R) => Either<E, A>,
) => ReaderEither<R, E, A> = identity
