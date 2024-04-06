/**
 * Utility functions to accommodate `fp-ts/Reader`.
 *
 * @since 0.15.0
 */
import type { Reader } from "fp-ts/Reader"
import { apply } from "fp-ts/function"

/**
 * Runs a Reader and extracts the final value from it.
 *
 * @example
 * import { runReader } from 'fp-ts-std/Reader'
 * import { pipe } from "fp-ts/function"
 * import * as R from 'fp-ts/Reader'
 *
 * type Env = { dependency: string }
 * const env: Env = { dependency: "dependency " }
 * const extractedValue = pipe(R.of<Env, number>(1), runReader(env))
 * assert.strictEqual(extractedValue, 1)
 *
 * @category 3 Functions
 * @since 0.15.0
 */
export const runReader: <R, A>(r: R) => (reader: Reader<R, A>) => A = apply
