/**
 * Utilities to accommodate `fp-ts/Random`.
 *
 * @since 0.12.0
 */

import * as IO from "fp-ts/IO"
type IO<A> = IO.IO<A>
import { flow, pipe } from "fp-ts/function"
import { NonEmptyArray } from "fp-ts/NonEmptyArray"
import * as RA from "fp-ts/ReadonlyArray"
import { extractAt } from "./Array"
import * as Rand from "fp-ts/Random"
import { decrement } from "./Number"
import { unsafeUnwrap } from "./Option"

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
