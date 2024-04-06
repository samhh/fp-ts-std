/**
 * Various functions to aid in working with JavaScript's `Date` object.
 *
 * @since 0.1.0
 */

import { now as nownum } from "fp-ts/Date"
import * as IO from "fp-ts/IO"
import { Predicate } from "fp-ts/Predicate"
import { Refinement } from "fp-ts/Refinement"
import { flow, pipe } from "fp-ts/function"
import { Field as fieldNumber, Ord as ordNumber } from "fp-ts/number"
import { Newtype, getField, getOrd, iso } from "newtype-ts"
import { isValid as isValidNum } from "./Number"
type IO<A> = IO.IO<A>
import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import { construct, invokeOn, isInstanceOf } from "./Function"
import { pack, unpack } from "./Newtype"

/**
 * Parse a date, leaving open the risk of a failure to parse resulting in an
 * invalid `Date` being returned.
 *
 * @example
 * import { unsafeParseDate } from 'fp-ts-std/Date'
 *
 * const valid = 0
 * const invalid = 'this will not parse'
 *
 * assert.strictEqual(unsafeParseDate(valid).getTime(), 0)
 * assert.strictEqual(unsafeParseDate(invalid).getTime(), NaN)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const unsafeParseDate = (x: string | number): Date =>
	construct(Date)([x])

type MillisecondsSymbol = { readonly Milliseconds: unique symbol }

/**
 * Newtype representing milliseconds.
 *
 * @example
 * import { Milliseconds, mkMilliseconds } from 'fp-ts-std/Date'
 *
 * const second: Milliseconds = mkMilliseconds(1000)
 *
 * @category 0 Types
 * @since 0.7.0
 */
export type Milliseconds = Newtype<MillisecondsSymbol, number>

/**
 * `Ord` instance for `Milliseconds`, enabling comparison between different
 * instances of the type.
 *
 * @example
 * import { ordMilliseconds, mkMilliseconds } from 'fp-ts-std/Date'
 * import { LT } from 'fp-ts-std/Ordering'
 *
 * assert.strictEqual(ordMilliseconds.compare(mkMilliseconds(0), mkMilliseconds(1)), LT)
 *
 * @category 1 Typeclass Instances
 * @since 0.7.0
 */
export const ordMilliseconds = getOrd<Milliseconds>(ordNumber)

/**
 * `Field` instance for `Milliseconds`, enabling arithmetic over the type.
 *
 * @example
 * import { fieldMilliseconds, mkMilliseconds } from 'fp-ts-std/Date'
 *
 * assert.strictEqual(
 *   fieldMilliseconds.add(mkMilliseconds(2), mkMilliseconds(3)),
 *   mkMilliseconds(5),
 * )
 *
 * @category 1 Typeclass Instances
 * @since 0.7.0
 */
export const fieldMilliseconds = getField<Milliseconds>(fieldNumber)

/**
 * `Iso` instance for `Milliseconds`, enabling the use of lenses over the
 * newtype pertaining to its isomorphic nature.
 *
 * @example
 * import { isoMilliseconds, mkMilliseconds } from 'fp-ts-std/Date'
 * import { add } from 'fp-ts-std/Number'
 *
 * assert.strictEqual(
 *   isoMilliseconds.modify(add(3))(mkMilliseconds(2)),
 *   mkMilliseconds(5),
 * )
 *
 * @category 1 Typeclass Instances
 * @since 0.7.0
 */
export const isoMilliseconds = iso<Milliseconds>()

/**
 * Lift a number to the `Milliseconds` newtype.
 *
 * @example
 * import { mkMilliseconds } from 'fp-ts-std/Date'
 *
 * const second = mkMilliseconds(1000)
 *
 * @category 3 Functions
 * @since 0.7.0
 */
export const mkMilliseconds: (n: number) => Milliseconds = pack

/**
 * Unwrap a `Milliseconds` newtype back to its underlying number representation.
 *
 * @example
 * import { flow } from 'fp-ts/function'
 * import { Endomorphism } from 'fp-ts/Endomorphism'
 * import { mkMilliseconds, unMilliseconds } from 'fp-ts-std/Date'
 *
 * const redundant: Endomorphism<number> = flow(mkMilliseconds, unMilliseconds)
 *
 * @category 3 Functions
 * @since 0.7.0
 */
export const unMilliseconds: (ms: Milliseconds) => number = unpack

/**
 * Get a `Date` from `Milliseconds`.
 *
 * @example
 * import { fromMilliseconds, mkMilliseconds } from 'fp-ts-std/Date'
 *
 * assert.deepStrictEqual(
 *   fromMilliseconds(mkMilliseconds(123)),
 *   new Date(123),
 * )
 *
 * @category 3 Functions
 * @since 0.7.0
 */
export const fromMilliseconds: (x: Milliseconds) => Date = flow(
	unMilliseconds,
	unsafeParseDate,
)

/**
 * Get the time in milliseconds from a `Date`.
 *
 * @example
 * import { getTime } from 'fp-ts-std/Date'
 *
 * const d = new Date()
 *
 * assert.strictEqual(getTime(d), d.getTime())
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const getTime: (x: Date) => Milliseconds = flow(
	invokeOn<Date>()("getTime")([]),
	mkMilliseconds,
)

/**
 * Returns a date as a string value in ISO format.
 *
 * @example
 * import { toISOString } from 'fp-ts-std/Date'
 *
 * const d = new Date()
 *
 * assert.strictEqual(toISOString(d), d.toISOString())
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const toISOString: (x: Date) => string = invokeOn<Date>()("toISOString")(
	[],
)

/**
 * Returns a date converted to a string using Universal Coordinated Time (UTC).
 *
 * @example
 * import { toUTCString } from 'fp-ts-std/Date'
 *
 * const d = new Date()
 *
 * assert.strictEqual(toUTCString(d), d.toUTCString())
 *
 * @category 3 Functions
 * @since 0.14.0
 */
export const toUTCString: (x: Date) => string = invokeOn<Date>()("toUTCString")(
	[],
)

/**
 * Check if a foreign value is a `Date`.
 *
 * @example
 * import { isDate } from 'fp-ts-std/Date'
 *
 * assert.strictEqual(isDate(new Date()), true)
 * assert.strictEqual(isDate({ not: { a: 'date' } }), false)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const isDate: Refinement<unknown, Date> = isInstanceOf(Date)

/**
 * Check if a `Date` is actually valid. (We all love JavaScript, don't we?)
 *
 * @example
 * import { isValid } from 'fp-ts-std/Date'
 *
 * const valid = new Date()
 * const invalid = new Date('this will not parse')
 *
 * assert.strictEqual(isValid(valid), true)
 * assert.strictEqual(isValid(invalid), false)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const isValid: Predicate<Date> = flow(
	getTime,
	unMilliseconds,
	isValidNum,
)

/**
 * Safely parse a date.
 *
 * @example
 * import { parseDate } from 'fp-ts-std/Date'
 * import * as O from 'fp-ts/Option'
 *
 * const valid = 0
 * const invalid = 'this will not parse'
 *
 * assert.deepStrictEqual(parseDate(valid), O.some(new Date(valid)))
 * assert.deepStrictEqual(parseDate(invalid), O.none)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const parseDate: (ts: string | number) => Option<Date> = flow(
	unsafeParseDate,
	O.fromPredicate(isValid),
)

/**
 * Get the time since the Unix Epoch in `Milliseconds` from a `Date`.
 *
 * @example
 * import { now, mkMilliseconds } from 'fp-ts-std/Date'
 *
 * const x1970 = mkMilliseconds(0)
 * const x2065 = mkMilliseconds(3000000000000)
 *
 * assert.strictEqual(now() > x1970, true)
 * assert.strictEqual(now() < x2065, true)
 *
 * @category 3 Functions
 * @since 0.7.0
 */
export const now: IO<Milliseconds> = pipe(nownum, IO.map(mkMilliseconds))
