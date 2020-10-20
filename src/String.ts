/**
 * @since 0.1.0
 */

import { pipe, Predicate, Refinement, Endomorphism, flow } from 'fp-ts/function';
import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';
import { join } from './Array';

/**
 * Get the length of a string.
 *
 * @since 0.1.0
 */
export const length = (x: string): number => x.length;

/**
 * Convert a number to a string.
 *
 * @since 0.1.0
 */
export const fromNumber = (x: number): string => String(x);

/**
 * Refine a foreign value to a string.
 *
 * @since 0.1.0
 */
export const isString: Refinement<unknown, string> = (x): x is string => typeof x === 'string';

/**
 * Check if a string is empty.
 *
 * @since 0.1.0
 */
export const isEmpty: Predicate<string> = (x) => x === '';

/**
 * Check if a string contains a given substring.
 *
 * @since 0.1.0
 */
export const contains = (substring: string): Predicate<string> => (target) =>
    target.includes(substring);

/**
 * Trim both sides of a string.
 *
 * @since 0.1.0
 */
export const trim: Endomorphism<string> = (x) => x.trim();

/**
 * Trim the left side of a string.
 *
 * @since 0.1.0
 */
export const trimLeft: Endomorphism<string> = (x) => x.trimLeft();

/**
 * Trim the right side of a string.
 *
 * @since 0.1.0
 */
export const trimRight: Endomorphism<string> = (x) => x.trimRight();

/**
 * Check if a string starts with the specified substring.
 *
 * @since 0.3.0
 */
export const startsWith = (substring: string): Predicate<string> => y => y.startsWith(substring);

/**
 * Check if a string ends with the specified substring.
 *
 * @since 0.3.0
 */
export const endsWith = (substring: string): Predicate<string> => y => y.endsWith(substring);

/**
 * Concatenate two strings together.
 *
 * @since 0.1.0
 */
export const concat = (x: string): Endomorphism<string> => (y) => x + y;

/**
 * Prepend one string to another.
 *
 * @since 0.1.0
 */
export const prepend = (prepended: string) => (rest: string): string => prepended + rest;

/**
 * Remove the beginning of a string, if it exists.
 *
 * @since 0.1.0
 */
export const unprepend = (start: string) => (val: string): string => val.startsWith(start)
    ? val.substring(start.length)
    : val;

/**
 * Append one string to another.
 *
 * @since 0.1.0
 */
export const append = (appended: string) => (rest: string): string => rest + appended;

/**
 * Remove the end of a string, if it exists.
 *
 * @since 0.1.0
 */
export const unappend = (end: string) => (val: string): string => val.endsWith(end)
    ? val.substring(0, val.lastIndexOf(end))
    : val;

/**
 * Surround a string. Equivalent to calling `prepend` and `append` with the
 * same outer value.
 *
 * @since 0.1.0
 */
export const surround = (x: string): Endomorphism<string> => flow(prepend(x), append(x));

/**
 * Remove the start and end of a string, if they both exist.
 *
 * @since 0.1.0
 */
export const unsurround = (start: string) => (end: string): Endomorphism<string> => val =>
    val.startsWith(start) && val.endsWith(end)
        ? pipe(val, unprepend(start), unappend(end))
        : val;

/**
 * Functional wrapper around `String.prototype.match`.
 *
 * @since 0.1.0
 */
export const match = (r: RegExp) => (x: string): Option<RegExpMatchArray> =>
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    O.fromNullable(x.match(r));

/**
 * Split a string into substrings using the specified separator and return them
 * as an array.
 *
 * @since 0.1.0
 */
export const split = (on: string | RegExp) => (target: string): Array<string> => target.split(on);

// The regex comes from here: https://stackoverflow.com/a/20056634
/**
 * Split a string into substrings using any recognised newline as the separator.
 *
 * @since 0.1.0
 */
export const lines = split(/\r\n|\r|\n/);

/**
 * Join newline-separated strings together.
 *
 * @since 0.1.0
 */
export const unlines = join('\n');

/**
 * A functional wrapper around `RegExp.prototype.exec`.
 *
 * @since 0.2.0
 */
export const exec = (r: RegExp) => (x: string): Option<RegExpExecArray> =>
    pipe(r.exec(x), O.fromNullable);

/**
 * A functional wraper around `RegExp.prototype.test`.
 *
 * @since 0.1.0
 */
export const test = (r: RegExp): Predicate<string> => x => r.test(x);

