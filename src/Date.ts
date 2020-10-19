/**
 * @since 0.1.0
 */

import { flow, not, Predicate, Refinement } from 'fp-ts/function';
import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';

/**
 * Get the time in milliseconds from a `Date`.
 *
 * @since 0.1.0
 */
export const getTime = (x: Date): number => x.getTime();

/**
 * Returns a date as a string value in ISO format.
 *
 * @since 0.1.0
 */
export const toISOString = (x: Date): string => x.toISOString();

/**
 * Check if a foreign value is a `Date`.
 *
 * @since 0.1.0
 */
export const isDate: Refinement<unknown, Date> = (x): x is Date => x instanceof Date;

/**
 * Check if a `Date` is actually valid. (We all love JavaScript, don't we?)
 *
 * @since 0.1.0
 */
export const isValid: Predicate<Date> = flow(getTime, not(Number.isNaN));

/**
 * Parse a date, leaving open the risk of a failure to parse resulting in an
 * invalid `Date` being returned.
 *
 * @since 0.1.0
 */
export const unsafeParseDate = (x: string | number): Date => new Date(x);

/**
 * Safely parse a date.
 *
 * @since 0.1.0
 */
export const parseDate: (ts: string | number) => Option<Date> =
    flow(unsafeParseDate, O.fromPredicate(isValid));

