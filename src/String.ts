/**
 * Various functions to aid in working with strings.
 *
 * @since 0.1.0
 */

import { pipe, flow } from "fp-ts/function"
import { Predicate, not } from "fp-ts/Predicate"
import { Endomorphism } from "fp-ts/Endomorphism"
import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import { NonEmptyArray } from "fp-ts/NonEmptyArray"
import * as NEA from "fp-ts/NonEmptyArray"
import * as RA from "fp-ts/ReadonlyArray"
import * as S from "fp-ts/string"
import {
  join,
  dropRightWhile as dropRightWhileRA,
  takeRightWhile as takeRightWhileRA,
} from "./ReadonlyArray"
import { max } from "fp-ts/Ord"
import { Ord as ordNumber } from "fp-ts/number"

/**
 * Convert a number to a string.
 *
 * @example
 * import { fromNumber } from 'fp-ts-std/String';
 *
 * assert.strictEqual(fromNumber(3), '3');
 *
 * @since 0.1.0
 */
export const fromNumber = (x: number): string => String(x)

/**
 * Prepend one string to another.
 *
 * @example
 * import { prepend } from 'fp-ts-std/String';
 *
 * const prependShell = prepend('$ ');
 *
 * assert.strictEqual(prependShell('abc'), '$ abc');
 *
 * @since 0.1.0
 */
export const prepend =
  (prepended: string): Endomorphism<string> =>
  rest =>
    prepended + rest

/**
 * Remove the beginning of a string, if it exists.
 *
 * @example
 * import { unprepend } from 'fp-ts-std/String';
 *
 * const unprependShell = unprepend('$ ');
 *
 * assert.strictEqual(unprependShell('$ abc'), 'abc');
 *
 * @since 0.1.0
 */
export const unprepend =
  (start: string): Endomorphism<string> =>
  val =>
    val.startsWith(start) ? val.substring(start.length) : val

/**
 * Append one string to another.
 *
 * @example
 * import { append } from 'fp-ts-std/String';
 *
 * const withExt = append('.hs');
 *
 * assert.strictEqual(withExt('File'), 'File.hs');
 *
 * @since 0.1.0
 */
export const append =
  (appended: string): Endomorphism<string> =>
  rest =>
    rest + appended

/**
 * Remove the end of a string, if it exists.
 *
 * @example
 * import { unappend } from 'fp-ts-std/String';
 *
 * const withoutExt = unappend('.hs');
 *
 * assert.strictEqual(withoutExt('File.hs'), 'File');
 *
 * @since 0.1.0
 */
export const unappend =
  (end: string) =>
  (val: string): string =>
    val.endsWith(end) ? val.substring(0, val.lastIndexOf(end)) : val

/**
 * Surround a string. Equivalent to calling `prepend` and `append` with the
 * same outer value.
 *
 * @example
 * import { surround } from 'fp-ts-std/String';
 *
 * const quote = surround('"');
 *
 * assert.strictEqual(quote('abc'), '"abc"');
 *
 * @since 0.1.0
 */
export const surround = (x: string): Endomorphism<string> =>
  flow(prepend(x), append(x))

/**
 * Remove the start and end of a string, if they both exist.
 *
 * @example
 * import { unsurround } from 'fp-ts-std/String';
 *
 * const unquote = unsurround('"');
 *
 * assert.strictEqual(unquote('"abc"'), 'abc');
 *
 * @since 0.1.0
 */
export const unsurround =
  (x: string): Endomorphism<string> =>
  val =>
    val.startsWith(x) && val.endsWith(x)
      ? pipe(val, unprepend(x), unappend(x))
      : val

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
 * @example
 * import { takeLeft } from 'fp-ts-std/String';
 *
 * assert.strictEqual(takeLeft(2)('abc'), 'ab');
 *
 * @since 0.3.0
 */
export const takeLeft = (n: number): Endomorphism<string> =>
  S.slice(0, max(ordNumber)(0, n))

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
 * @example
 * import { takeRight } from 'fp-ts-std/String';
 *
 * assert.strictEqual(takeRight(2)('abc'), 'bc');
 *
 * @since 0.3.0
 */
export const takeRight =
  (n: number): Endomorphism<string> =>
  x =>
    S.slice(max(ordNumber)(0, x.length - Math.floor(n)), Infinity)(x)

/**
 * Functional wrapper around `String.prototype.match`.
 *
 * @example
 * import { match } from 'fp-ts-std/String';
 * import * as O from 'fp-ts/Option';
 * import { flow } from 'fp-ts/function';
 *
 * const f = flow(match(/^(\d)(\w)$/), O.map(xs => Array.from(xs)));
 *
 * assert.deepStrictEqual(f('2e'), O.some(['2e', '2', 'e']));
 * assert.deepStrictEqual(f('foo'), O.none);
 *
 * @since 0.1.0
 */
export const match =
  (r: RegExp) =>
  (x: string): Option<RegExpMatchArray> =>
    O.fromNullable(x.match(r))

/**
 * A functional wrapper around `String.prototype.matchAll`.
 *
 * If the provided `RegExp` is non-global, the function will return `None`.
 *
 * @example
 * import { matchAll } from 'fp-ts-std/String';
 * import * as O from 'fp-ts/Option';
 * import * as NEA from 'fp-ts/NonEmptyArray';
 * import { flow } from 'fp-ts/function';
 *
 * const f = flow(
 *     matchAll(/t(e)(st(\d?))/g),
 *     O.map(NEA.map(xs => Array.from(xs))),
 * );
 *
 * assert.deepStrictEqual(f('test1test2'), O.some([['test1', 'e', 'st1', '1'], ['test2', 'e', 'st2', '2']]));
 *
 * @since 0.5.0
 */
export const matchAll =
  (r: RegExp) =>
  (x: string): Option<NonEmptyArray<RegExpMatchArray>> =>
    pipe(
      O.tryCatch(() => x.matchAll(r)),
      O.chain(flow(xs => Array.from(xs), NEA.fromArray)),
    )

/**
 * Apply an endomorphism upon an array of strings (characters) against a string.
 * This is useful as it allows you to run many polymorphic functions targeting
 * arrays against strings without having to rewrite them.
 *
 * The name "under" is borrowed from newtypes, and expresses the notion that
 * a string can be thought of merely as an array of characters.
 *
 * @example
 * import { under } from 'fp-ts-std/String';
 * import * as RA from 'fp-ts/ReadonlyArray';
 *
 * const filterOutX = under(RA.filter(x => x !== "x"));
 *
 * assert.strictEqual(filterOutX("axbxc"), "abc");
 *
 * @since 0.7.0
 */
export const under = (
  f: Endomorphism<ReadonlyArray<string>>,
): Endomorphism<string> =>
  flow(
    S.split(""),
    xs => xs,
    f,
    xs => xs,
    join(""),
  )

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
export const reverse: Endomorphism<string> = under(RA.reverse)

// The regex comes from here: https://stackoverflow.com/a/20056634
/**
 * Split a string into substrings using any recognised newline as the separator.
 *
 * @example
 * import { lines } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(lines('a\nb\nc'), ['a', 'b', 'c']);
 *
 * @since 0.1.0
 */
export const lines = S.split(/\r\n|\r|\n/)

/**
 * Join newline-separated strings together.
 *
 * @example
 * import { unlines } from 'fp-ts-std/String';
 *
 * assert.strictEqual(unlines(['a', 'b', 'c']), 'a\nb\nc');
 *
 * @since 0.1.0
 */
export const unlines = join("\n")

/**
 * A functional wrapper around `RegExp.prototype.test`.
 *
 * @example
 * import { test } from 'fp-ts-std/String';
 *
 * const hasVowel = test(/(a|e|i|o|u)/);
 *
 * assert.strictEqual(hasVowel('meow'), true);
 * assert.strictEqual(hasVowel('grrr'), false);
 *
 * @since 0.1.0
 */
export const test =
  (r: RegExp): Predicate<string> =>
  x =>
    r.test(x)

/**
 * Replace every occurrence of a matched substring with a replacement.
 *
 * To use a `RegExp` (with a global flag) instead of a string to match, use
 * `replace` instead.
 *
 * @example
 * import { replaceAll } from 'fp-ts-std/String';
 *
 * assert.strictEqual(replaceAll('foo')('bar')('foo foo foo'), 'bar bar bar');
 *
 * @since 0.7.0
 */
export const replaceAll =
  (r: string | RegExp) =>
  (s: string): Endomorphism<string> =>
  x =>
    x.replace(new RegExp(r, "g"), s)

/**
 * Drop a number of characters from the start of a string, returning a new
 * string.
 *
 * If `n` is larger than the available number of characters, an empty string
 * will be returned.
 *
 * If `n` is not a positive number, the string will be returned whole.
 *
 * If `n` is a float, it will be rounded down to the nearest integer.
 *
 * @example
 * import { dropLeft } from 'fp-ts-std/String';
 *
 * assert.strictEqual(dropLeft(2)('abc'), 'c');
 *
 * @since 0.6.0
 */
export const dropLeft =
  (n: number): Endomorphism<string> =>
  x =>
    x.substring(n)

/**
 * Drop a number of characters from the end of a string, returning a new
 * string.
 *
 * If `n` is larger than the available number of characters, an empty string
 * will be returned.
 *
 * If `n` is not a positive number, the string will be returned whole.
 *
 * If `n` is a float, it will be rounded down to the nearest integer.
 *
 * @example
 * import { dropRight } from 'fp-ts-std/String';
 *
 * assert.strictEqual(dropRight(2)('abc'), 'a');
 *
 * @since 0.3.0
 */
export const dropRight =
  (n: number): Endomorphism<string> =>
  x =>
    x.substring(0, x.length - Math.floor(n))

/**
 * Remove the longest initial substring for which all characters satisfy the
 * specified predicate, creating a new string.
 *
 * @example
 * import { dropLeftWhile } from 'fp-ts-std/String';
 *
 * const dropFilename = dropLeftWhile(x => x !== '.');
 *
 * assert.strictEqual(dropFilename('File.hs'), '.hs')
 *
 * @since 0.6.0
 */
export const dropLeftWhile = (f: Predicate<string>): Endomorphism<string> =>
  pipe(RA.dropLeftWhile(f), under)

/**
 * Remove the longest initial substring from the end of the input string for
 * which all characters satisfy the specified predicate, creating a new string.
 *
 * @example
 * import { dropRightWhile } from 'fp-ts-std/String';
 * import { elemFlipped } from 'fp-ts-std/Array';
 * import { eqString } from 'fp-ts/Eq';
 *
 * const isVowel = elemFlipped(eqString)(['a', 'e', 'i', 'o', 'u']);
 * const dropRightVowels = dropRightWhile(isVowel);
 *
 * assert.deepStrictEqual(dropRightVowels('hellooo'), 'hell');
 *
 * @since 0.7.0
 */
export const dropRightWhile: (f: Predicate<string>) => Endomorphism<string> =
  flow(dropRightWhileRA, under)

/**
 * Get the first character in a string, or `None` if the string is empty.
 *
 * @example
 * import { head } from 'fp-ts-std/String';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(head('abc'), O.some('a'));
 * assert.deepStrictEqual(head(''), O.none);
 *
 * @since 0.6.0
 */
export const head: (x: string) => Option<string> = flow(
  O.fromPredicate(not(S.isEmpty)),
  O.map(takeLeft(1)),
)

/**
 * Get all but the first character of a string, or `None` if the string is empty.
 *
 * @example
 * import { tail } from 'fp-ts-std/String';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(tail(''), O.none);
 * assert.deepStrictEqual(tail('a'), O.some(''));
 * assert.deepStrictEqual(tail('ab'), O.some('b'));
 * assert.deepStrictEqual(tail('abc'), O.some('bc'));
 *
 * @since 0.6.0
 */
export const tail: (x: string) => Option<string> = flow(
  O.fromPredicate(not(S.isEmpty)),
  O.map(dropLeft(1)),
)

/**
 * Get the last character in a string, or `None` if the string is empty.
 *
 * @example
 * import { last } from 'fp-ts-std/String';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(last('abc'), O.some('c'));
 * assert.deepStrictEqual(last(''), O.none);
 *
 * @since 0.7.0
 */
export const last: (x: string) => Option<string> = flow(
  O.fromPredicate(not(S.isEmpty)),
  O.map(takeRight(1)),
)

/**
 * Get all but the last character of a string, or `None` if the string is empty.
 *
 * @example
 * import { init } from 'fp-ts-std/String';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(init(''), O.none);
 * assert.deepStrictEqual(init('a'), O.some(''));
 * assert.deepStrictEqual(init('ab'), O.some('a'));
 * assert.deepStrictEqual(init('abc'), O.some('ab'));
 *
 * @since 0.7.0
 */
export const init: (x: string) => Option<string> = flow(
  O.fromPredicate(not(S.isEmpty)),
  O.map(dropRight(1)),
)

/**
 * Attempt to access the character at the specified index of a string.
 *
 * @example
 * import { lookup } from 'fp-ts-std/String';
 * import * as O from 'fp-ts/Option';
 *
 * assert.deepStrictEqual(lookup(0)(''), O.none);
 * assert.deepStrictEqual(lookup(0)('abc'), O.some('a'));
 *
 * @since 0.7.0
 */
export const lookup =
  (i: number) =>
  (x: string): Option<string> =>
    O.fromNullable(x[i])

/**
 * Calculate the longest initial substring for which all characters satisfy the
 * specified predicate, creating a new string.
 *
 * @example
 * import { takeLeftWhile } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(takeLeftWhile(x => x !== 'c')('abcd'), 'ab');
 *
 * @since 0.7.0
 */
// The pointful first function is needed to typecheck for some reason
export const takeLeftWhile: (f: Predicate<string>) => Endomorphism<string> =
  flow(f => RA.takeLeftWhile(f), under)

/**
 * Calculate the longest initial substring from the end of the input string
 * for which all characters satisfy the specified predicate, creating a new
 * string.
 *
 * @example
 * import { takeRightWhile } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(takeRightWhile(x => x !== 'b')('abcd'), 'cd');
 *
 * @since 0.7.0
 */
export const takeRightWhile: (f: Predicate<string>) => Endomorphism<string> =
  flow(takeRightWhileRA, under)

/**
 * Partition a string into parts at an index.
 * Resulting parts can then be handled using fp-ts/Tuple.
 *
 * @example
 *
 * import { splitAt } from 'fp-ts-std/String';
 *
 * assert.deepStrictEqual(splitAt(1)("abc"), ["a", "bc"]);
 *
 * @since 0.11.0
 */
export const splitAt =
  (index: number) =>
  (str: string): [string, string] =>
    [S.slice(0, index)(str), S.slice(index, Infinity)(str)]

/**
 * Tests if a string exclusively consists of alphabetic characters. Behaviour
 * in case of an empty string is unspecified.
 *
 * @example
 *
 * import { isAlpha } from 'fp-ts-std/String';
 *
 * assert.strictEqual(isAlpha("abc"), true);
 * assert.strictEqual(isAlpha("123"), false);
 * assert.strictEqual(isAlpha("abc123"), false);
 *
 * @since 0.11.0
 */
export const isAlpha: Predicate<string> = test(/^\p{Alpha}+$/u)

/**
 * Tests if a string exclusively consists of alphabetic or numeric characters.
 * Behaviour in case of an empty string is unspecified.
 *
 * @example
 *
 * import { isAlphaNum } from 'fp-ts-std/String';
 *
 * assert.strictEqual(isAlphaNum("abc123"), true);
 * assert.strictEqual(isAlphaNum("abc123!"), false);
 *
 * @since 0.11.0
 */
export const isAlphaNum: Predicate<string> = test(/^(\p{Alpha}|\p{Number})+$/u)

/**
 * Tests if a string exclusively consists of lowercase alphabetic characters.
 * Behaviour in case of an empty string is unspecified.
 *
 * @example
 *
 * import { isLower } from 'fp-ts-std/String';
 *
 * assert.strictEqual(isLower("hello"), true);
 * assert.strictEqual(isLower("Hello"), false);
 * assert.strictEqual(isLower("hello1"), false);
 *
 * @since 0.11.0
 */
export const isLower: Predicate<string> = test(/^\p{Lower}+$/u)

/**
 * Tests if a string exclusively consists of uppercase alphabetic characters.
 * Behaviour in case of an empty string is unspecified.
 *
 * @example
 *
 * import { isUpper } from 'fp-ts-std/String';
 *
 * assert.strictEqual(isUpper("HELLO"), true);
 * assert.strictEqual(isUpper("Hello"), false);
 * assert.strictEqual(isUpper("HELLO1"), false);
 *
 * @since 0.11.0
 */
export const isUpper: Predicate<string> = test(/^\p{Upper}+$/u)
