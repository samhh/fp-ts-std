/**
 * @since 0.1.0
 */

import { pipe, Predicate, Refinement, Endomorphism, flow } from 'fp-ts/function';
import { Option } from 'fp-ts/Option';
import * as O from 'fp-ts/Option';
import { NonEmptyArray } from 'fp-ts/NonEmptyArray';
import * as NEA from 'fp-ts/NonEmptyArray';
import * as A from 'fp-ts/Array';
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
export const unsurround = (x: string): Endomorphism<string> => val =>
    val.startsWith(x) && val.endsWith(x)
        ? pipe(val, unprepend(x), unappend(x))
        : val;

/**
 * Keep the specified number of characters from the start of a string.
 *
 * If `n` is larger than the available number of characters, the string will
 * be returned whole.
 *
 * If `n` is not a positive number, an empty string will be returned.
 *
 * If `n` is a float, it will be rounded down to the nearest integer.
 *
 * @since 0.3.0
 */
export const takeLeft = (n: number): Endomorphism<string> => x =>
    x.slice(0, Math.max(0, n));

/**
 * Keep the specified number of characters from the end of a string.
 *
 * If `n` is larger than the available number of characters, the string will
 * be returned whole.
 *
 * If `n` is not a positive number, an empty string will be returned.
 *
 * If `n` is a float, it will be rounded down to the nearest integer.
 *
 * @since 0.3.0
 */
export const takeRight = (n: number): Endomorphism<string> => x =>
    x.slice(Math.max(0, x.length - Math.floor(n)));

/**
 * Functional wrapper around `String.prototype.match`.
 *
 * @since 0.1.0
 */
export const match = (r: RegExp) => (x: string): Option<RegExpMatchArray> =>
    O.fromNullable(x.match(r));

/**
 * A functional wrapper around `String.prototype.matchAll`.
 *
 * If the provided `RegExp` is non-global, the function will return `None`.
 *
 * @since 0.5.0
 */
export const matchAll = (r: RegExp) => (x: string): Option<NonEmptyArray<RegExpMatchArray>> =>
    pipe(O.tryCatch(() => x.matchAll(r)), O.chain(flow(xs => Array.from(xs), NEA.fromArray)));

/**
 * Split a string into substrings using the specified separator and return them
 * as an array.
 *
 * @since 0.1.0
 */
export const split = (on: string | RegExp) => (target: string): Array<string> => target.split(on);

/**
 * Reverse a string.
 *
 * @example
 * import { reverse } from 'fp-ts-std/String';
 *
 * assert.strictEqual(reverse('abc'), 'cba');
 *
 * @since 0.3.0
 */
export const reverse: Endomorphism<string> = flow(split(''), A.reverse, join(''));

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
 * A functional wraper around `RegExp.prototype.test`.
 *
 * @since 0.1.0
 */
export const test = (r: RegExp): Predicate<string> => x => r.test(x);

