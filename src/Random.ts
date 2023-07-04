/**
 * Utilities to accommodate `fp-ts/Random`.
 *
 * @since 0.12.0
 */

import * as IO from "fp-ts/lib/IO.js"
type IO<A> = IO.IO<A>
import { flow, pipe } from "fp-ts/lib/function.js"
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray.js"
import * as RA from "fp-ts/lib/ReadonlyArray.js"
import { extractAt } from "./Array.js"
import * as Rand from "fp-ts/lib/Random.js"
import { decrement } from "./Number.js"
import { unsafeUnwrap } from "./Option.js"

/**
 * Like `fp-ts/Array::randomElem`, but returns the remainder of the array as
 * well.
 *
 * @example
 * import { randomExtract } from 'fp-ts-std/Random'
 *
 * assert.deepStrictEqual(randomExtract(['x'])(), ['x', []])
 *
 * @category 3 Functions
 * @since 0.12.0
 */
export const randomExtract = <A>(xs: NonEmptyArray<A>): IO<[A, Array<A>]> =>
  pipe(
    Rand.randomInt(0, pipe(xs, RA.size, decrement)),
    IO.map(flow(i => extractAt(i)(xs), unsafeUnwrap)),
  )
