/**
 * @since 0.1.0
 */

import { flow, Predicate, Refinement } from "fp-ts/function"
import { isValid as isValidNum } from "./Number"
import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"

/**
 * Get the time in milliseconds from a `Date`.
 *
 * @example
 * import { getTime } from 'fp-ts-std/Date';
 *
 * const d = new Date();
 *
 * assert.strictEqual(getTime(d), d.getTime());
 *
 * @since 0.1.0
 */
export const getTime = (x: Date): number => x.getTime()

/**
 * Returns a date as a string value in ISO format.
 *
 * @example
 * import { toISOString } from 'fp-ts-std/Date';
 *
 * const d = new Date();
 *
 * assert.strictEqual(toISOString(d), d.toISOString());
 *
 * @since 0.1.0
 */
export const toISOString = (x: Date): string => x.toISOString()

/**
 * Check if a foreign value is a `Date`.
 *
 * @example
 * import { isDate } from 'fp-ts-std/Date';
 *
 * assert.strictEqual(isDate(new Date()), true);
 * assert.strictEqual(isDate({ not: { a: 'date' } }), false);
 *
 * @since 0.1.0
 */
export const isDate: Refinement<unknown, Date> = (x): x is Date =>
  x instanceof Date

/**
 * Check if a `Date` is actually valid. (We all love JavaScript, don't we?)
 *
 * @example
 * import { isValid } from 'fp-ts-std/Date';
 *
 * const valid = new Date();
 * const invalid = new Date('this will not parse');
 *
 * assert.strictEqual(isValid(valid), true);
 * assert.strictEqual(isValid(invalid), false);
 *
 * @since 0.1.0
 */
export const isValid: Predicate<Date> = flow(getTime, isValidNum)

/**
 * Parse a date, leaving open the risk of a failure to parse resulting in an
 * invalid `Date` being returned.
 *
 * @example
 * import { unsafeParseDate } from 'fp-ts-std/Date';
 *
 * const valid = 0;
 * const invalid = 'this will not parse';
 *
 * assert.strictEqual(unsafeParseDate(valid).getTime(), 0);
 * assert.strictEqual(unsafeParseDate(invalid).getTime(), NaN);
 *
 * @since 0.1.0
 */
export const unsafeParseDate = (x: string | number): Date => new Date(x)

/**
 * Safely parse a date.
 *
 * @example
 * import { parseDate } from 'fp-ts-std/Date';
 * import * as O from 'fp-ts/Option';
 *
 * const valid = 0;
 * const invalid = 'this will not parse';
 *
 * assert.deepStrictEqual(parseDate(valid), O.some(new Date(valid)));
 * assert.deepStrictEqual(parseDate(invalid), O.none);
 *
 * @since 0.1.0
 */
export const parseDate: (ts: string | number) => Option<Date> = flow(
  unsafeParseDate,
  O.fromPredicate(isValid),
)
