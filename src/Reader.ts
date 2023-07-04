/**
 * Utility functions to accommodate `fp-ts/Reader`.
 *
 * @since 0.15.0
 */
import { Reader } from "fp-ts/lib/Reader.js"
import { apply } from "fp-ts/lib/function.js"

/**
 * Runs a Reader and extracts the final value from it.
 *
 * @example
 * import { runReader } from 'fp-ts-std/Reader'
 * import { pipe } from "fp-ts/lib/function.js"
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
