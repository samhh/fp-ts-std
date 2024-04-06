/**
 * Various functions to aid in working with strings.
 *
 * @since 0.1.0
 */

import { Endomorphism } from "fp-ts/Endomorphism"
import { NonEmptyArray } from "fp-ts/NonEmptyArray"
import * as NEA from "fp-ts/NonEmptyArray"
import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import { max } from "fp-ts/Ord"
import { Predicate, and, not } from "fp-ts/Predicate"
import * as RA from "fp-ts/ReadonlyArray"
import { flip, flow, pipe } from "fp-ts/function"
import { Ord as ordNumber } from "fp-ts/number"
import * as S from "fp-ts/string"
import { invoke, when } from "./Function"
import {
	dropRightWhile as dropRightWhileRA,
	join,
	takeRightWhile as takeRightWhileRA,
} from "./ReadonlyArray"

/**
 * Convert a number to a string.
 *
 * @example
 * import { fromNumber } from 'fp-ts-std/String'
 *
 * assert.strictEqual(fromNumber(3), '3')
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const fromNumber: (x: number) => string = String

/**
 * Convert a boolean to a string.
 *
 * @example
 * import { fromBool } from 'fp-ts-std/String'
 *
 * assert.strictEqual(fromBool(true), 'true')
 * assert.strictEqual(fromBool(false), 'false')
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const fromBool: (x: boolean) => string = String

/**
 * Prepend one string to another.
 *
 * @example
 * import { prepend } from 'fp-ts-std/String'
 *
 * const prependShell = prepend('$ ')
 *
 * assert.strictEqual(prependShell('abc'), '$ abc')
 *
 * @category 3 Functions
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
 * import { unprepend } from 'fp-ts-std/String'
 *
 * const unprependShell = unprepend('$ ')
 *
 * assert.strictEqual(unprependShell('$ abc'), 'abc')
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const unprepend = (start: string): Endomorphism<string> =>
	when(S.startsWith(start))(dropLeft(start.length))

/**
 * Append one string to another.
 *
 * @example
 * import { append } from 'fp-ts-std/String'
 *
 * const withExt = append('.hs')
 *
 * assert.strictEqual(withExt('File'), 'File.hs')
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const append: (appended: string) => Endomorphism<string> = flip(prepend)

/**
 * Remove the end of a string, if it exists.
 *
 * @example
 * import { unappend } from 'fp-ts-std/String'
 *
 * const withoutExt = unappend('.hs')
 *
 * assert.strictEqual(withoutExt('File.hs'), 'File')
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const unappend = (end: string): Endomorphism<string> =>
	when(S.endsWith(end))(dropRight(end.length))

/**
 * Surround a string. Equivalent to calling `prepend` and `append` with the
 * same outer value.
 *
 * @example
 * import { surround } from 'fp-ts-std/String'
 *
 * const quote = surround('"')
 *
 * assert.strictEqual(quote('abc'), '"abc"')
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const surround = (x: string): Endomorphism<string> =>
	flow(prepend(x), append(x))

/**
 * Remove the start and end of a string, if they both exist.
 *
 * @example
 * import { unsurround } from 'fp-ts-std/String'
 *
 * const unquote = unsurround('"')
 *
 * assert.strictEqual(unquote('"abc"'), 'abc')
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const unsurround = (x: string): Endomorphism<string> =>
	when(and(S.startsWith(x))(S.endsWith(x)))(flow(unprepend(x), unappend(x)))

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
 * import { takeLeft } from 'fp-ts-std/String'
 *
 * assert.strictEqual(takeLeft(2)('abc'), 'ab')
 *
 * @category 3 Functions
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
 * import { takeRight } from 'fp-ts-std/String'
 *
 * assert.strictEqual(takeRight(2)('abc'), 'bc')
 *
 * @category 3 Functions
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
 * import { match } from 'fp-ts-std/String'
 * import * as O from 'fp-ts/Option'
 * import { flow } from 'fp-ts/function'
 *
 * const f = flow(match(/^(\d)(\w)$/), O.map(xs => Array.from(xs)))
 *
 * assert.deepStrictEqual(f('2e'), O.some(['2e', '2', 'e']))
 * assert.deepStrictEqual(f('foo'), O.none)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const match = (r: RegExp): ((x: string) => Option<RegExpMatchArray>) =>
	flow(invoke("match")([r]), O.fromNullable)

/**
 * A functional wrapper around `String.prototype.matchAll`.
 *
 * If the provided `RegExp` is non-global, the function will return `None`.
 *
 * @example
 * import { matchAll } from 'fp-ts-std/String'
 * import * as O from 'fp-ts/Option'
 * import * as NEA from 'fp-ts/NonEmptyArray'
 * import { flow } from 'fp-ts/function'
 *
 * const f = flow(
 *     matchAll(/t(e)(st(\d?))/g),
 *     O.map(NEA.map(xs => Array.from(xs))),
 * )
 *
 * assert.deepStrictEqual(f('test1test2'), O.some([['test1', 'e', 'st1', '1'], ['test2', 'e', 'st2', '2']]))
 *
 * @category 3 Functions
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
 * import { under } from 'fp-ts-std/String'
 * import * as RA from 'fp-ts/ReadonlyArray'
 *
 * const filterOutX = under(RA.filter(x => x !== "x"))
 *
 * assert.strictEqual(filterOutX("axbxc"), "abc")
 *
 * @category 3 Functions
 * @since 0.7.0
 */
export const under = (
	f: Endomorphism<ReadonlyArray<string>>,
): Endomorphism<string> => flow(S.split(""), f, join(""))

/**
 * Reverse a string.
 *
 * @example
 * import { reverse } from 'fp-ts-std/String'
 *
 * assert.strictEqual(reverse('abc'), 'cba')
 *
 * @category 3 Functions
 * @since 0.3.0
 */
export const reverse: Endomorphism<string> = under(RA.reverse)

// The regex comes from here: https://stackoverflow.com/a/20056634
/**
 * Split a string into substrings using any recognised newline as the separator.
 *
 * @example
 * import { lines } from 'fp-ts-std/String'
 *
 * assert.deepStrictEqual(lines('a\nb\nc'), ['a', 'b', 'c'])
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const lines = S.split(/\r\n|\r|\n/)

/**
 * Join newline-separated strings together.
 *
 * @example
 * import { unlines } from 'fp-ts-std/String'
 *
 * assert.strictEqual(unlines(['a', 'b', 'c']), 'a\nb\nc')
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const unlines = join("\n")

/**
 * A functional wrapper around `RegExp.prototype.test`.
 *
 * @example
 * import { test } from 'fp-ts-std/String'
 *
 * const hasVowel = test(/(a|e|i|o|u)/)
 *
 * assert.strictEqual(hasVowel('meow'), true)
 * assert.strictEqual(hasVowel('grrr'), false)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const test =
	(r: RegExp): Predicate<string> =>
	x => {
		const lastIndex = r.lastIndex
		const res = r.test(x)
		// eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
		r.lastIndex = lastIndex
		return res
	}

/**
 * Replace every occurrence of a matched substring with a replacement.
 *
 * To use a `RegExp` (with a global flag) instead of a string to match, use
 * `replace` in `fp-ts/string` instead.
 *
 * @example
 * import { replaceAll } from 'fp-ts-std/String'
 *
 * assert.strictEqual(replaceAll('foo')('bar')('foo foo foo'), 'bar bar bar')
 *
 * @category 3 Functions
 * @since 0.7.0
 */
export const replaceAll =
	(r: string) =>
	(s: string): Endomorphism<string> =>
		// COMPAT: Use native `replaceAll` method once we drop support for Node <15.
		invoke("replace")([new RegExp(r, "g"), s])

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
 * import { dropLeft } from 'fp-ts-std/String'
 *
 * assert.strictEqual(dropLeft(2)('abc'), 'c')
 *
 * @category 3 Functions
 * @since 0.6.0
 */
export const dropLeft = (n: number): Endomorphism<string> =>
	invoke("substring")([n])

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
 * import { dropRight } from 'fp-ts-std/String'
 *
 * assert.strictEqual(dropRight(2)('abc'), 'a')
 *
 * @category 3 Functions
 * @since 0.3.0
 */
export const dropRight =
	(n: number): Endomorphism<string> =>
	x =>
		pipe(x, invoke("substring")([0, x.length - Math.floor(n)]))

/**
 * Remove the longest initial substring for which all characters satisfy the
 * specified predicate, creating a new string.
 *
 * @example
 * import { dropLeftWhile } from 'fp-ts-std/String'
 *
 * const dropFilename = dropLeftWhile(x => x !== '.')
 *
 * assert.strictEqual(dropFilename('File.hs'), '.hs')
 *
 * @category 3 Functions
 * @since 0.6.0
 */
export const dropLeftWhile = (f: Predicate<string>): Endomorphism<string> =>
	pipe(RA.dropLeftWhile(f), under)

/**
 * Remove the longest initial substring from the end of the input string for
 * which all characters satisfy the specified predicate, creating a new string.
 *
 * @example
 * import { dropRightWhile } from 'fp-ts-std/String'
 * import { elemV } from 'fp-ts-std/Array'
 * import { eqString } from 'fp-ts/Eq'
 *
 * const isVowel = elemV(eqString)(['a', 'e', 'i', 'o', 'u'])
 * const dropRightVowels = dropRightWhile(isVowel)
 *
 * assert.deepStrictEqual(dropRightVowels('hellooo'), 'hell')
 *
 * @category 3 Functions
 * @since 0.7.0
 */
export const dropRightWhile: (f: Predicate<string>) => Endomorphism<string> =
	flow(dropRightWhileRA, under)

/**
 * Get the first character in a string, or `None` if the string is empty.
 *
 * @example
 * import { head } from 'fp-ts-std/String'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(head('abc'), O.some('a'))
 * assert.deepStrictEqual(head(''), O.none)
 *
 * @category 3 Functions
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
 * import { tail } from 'fp-ts-std/String'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(tail(''), O.none)
 * assert.deepStrictEqual(tail('a'), O.some(''))
 * assert.deepStrictEqual(tail('ab'), O.some('b'))
 * assert.deepStrictEqual(tail('abc'), O.some('bc'))
 *
 * @category 3 Functions
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
 * import { last } from 'fp-ts-std/String'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(last('abc'), O.some('c'))
 * assert.deepStrictEqual(last(''), O.none)
 *
 * @category 3 Functions
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
 * import { init } from 'fp-ts-std/String'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(init(''), O.none)
 * assert.deepStrictEqual(init('a'), O.some(''))
 * assert.deepStrictEqual(init('ab'), O.some('a'))
 * assert.deepStrictEqual(init('abc'), O.some('ab'))
 *
 * @category 3 Functions
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
 * import { lookup } from 'fp-ts-std/String'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(lookup(0)(''), O.none)
 * assert.deepStrictEqual(lookup(0)('abc'), O.some('a'))
 *
 * @category 3 Functions
 * @since 0.7.0
 */
export const lookup =
	(i: number) =>
	(x: string): Option<string> =>
		pipe(x[i], O.fromNullable)

/**
 * Calculate the longest initial substring for which all characters satisfy the
 * specified predicate, creating a new string.
 *
 * @example
 * import { takeLeftWhile } from 'fp-ts-std/String'
 *
 * assert.deepStrictEqual(takeLeftWhile(x => x !== 'c')('abcd'), 'ab')
 *
 * @category 3 Functions
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
 * import { takeRightWhile } from 'fp-ts-std/String'
 *
 * assert.deepStrictEqual(takeRightWhile(x => x !== 'b')('abcd'), 'cd')
 *
 * @category 3 Functions
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
 * import { splitAt } from 'fp-ts-std/String'
 *
 * assert.deepStrictEqual(splitAt(1)("abc"), ["a", "bc"])
 *
 * @category 3 Functions
 * @since 0.11.0
 */
export const splitAt =
	(index: number) =>
	(str: string): [string, string] => [
		S.slice(0, index)(str),
		S.slice(index, Infinity)(str),
	]

/**
 * Tests if a string exclusively consists of alphabetic characters. Behaviour
 * in case of an empty string is unspecified.
 *
 * @example
 *
 * import { isAlpha } from 'fp-ts-std/String'
 *
 * assert.strictEqual(isAlpha("abc"), true)
 * assert.strictEqual(isAlpha("123"), false)
 * assert.strictEqual(isAlpha("abc123"), false)
 *
 * @category 3 Functions
 * @since 0.11.0
 */
export const isAlpha: Predicate<string> = test(/^\p{Alpha}+$/u)

/**
 * Tests if a string exclusively consists of alphabetic or numeric characters.
 * Behaviour in case of an empty string is unspecified.
 *
 * @example
 *
 * import { isAlphaNum } from 'fp-ts-std/String'
 *
 * assert.strictEqual(isAlphaNum("abc123"), true)
 * assert.strictEqual(isAlphaNum("abc123!"), false)
 *
 * @category 3 Functions
 * @since 0.11.0
 */
export const isAlphaNum: Predicate<string> = test(/^(\p{Alpha}|\p{Number})+$/u)

/**
 * Tests if a string exclusively consists of lowercase alphabetic characters.
 * Behaviour in case of an empty string is unspecified.
 *
 * @example
 *
 * import { isLower } from 'fp-ts-std/String'
 *
 * assert.strictEqual(isLower("hello"), true)
 * assert.strictEqual(isLower("Hello"), false)
 * assert.strictEqual(isLower("hello1"), false)
 *
 * @category 3 Functions
 * @since 0.11.0
 */
export const isLower: Predicate<string> = test(/^\p{Lower}+$/u)

/**
 * Tests if a string exclusively consists of uppercase alphabetic characters.
 * Behaviour in case of an empty string is unspecified.
 *
 * @example
 *
 * import { isUpper } from 'fp-ts-std/String'
 *
 * assert.strictEqual(isUpper("HELLO"), true)
 * assert.strictEqual(isUpper("Hello"), false)
 * assert.strictEqual(isUpper("HELLO1"), false)
 *
 * @category 3 Functions
 * @since 0.11.0
 */
export const isUpper: Predicate<string> = test(/^\p{Upper}+$/u)

/**
 * Tests if a string exclusively consists of whitespace. Behaviour in case of
 * an empty string is unspecified.
 *
 * @example
 *
 * import { isSpace } from 'fp-ts-std/String'
 *
 * assert.strictEqual(isSpace(" "), true)
 * assert.strictEqual(isSpace("x"), false)
 * assert.strictEqual(isSpace("\n\t"), true)
 *
 * @category 3 Functions
 * @since 0.13.0
 */
export const isSpace: Predicate<string> = test(/^\s+$/)

/**
 * Split a string into substrings using any recognised whitespace as the
 * separator.
 *
 * @example
 * import { words } from 'fp-ts-std/String'
 *
 * assert.deepStrictEqual(words('a b\nc'), ['a', 'b', 'c'])
 *
 * @category 3 Functions
 * @since 0.14.0
 */
export const words = S.split(/\s/)

/**
 * Join whitespace-separated strings together.
 *
 * @example
 * import { unwords } from 'fp-ts-std/String'
 *
 * assert.strictEqual(unwords(['a', 'b', 'c']), 'a b c')
 *
 * @category 3 Functions
 * @since 0.14.0
 */
export const unwords = join(" ")

/**
 * Drop a prefix if present, else return the input string unmodified.
 *
 * @example
 * import { dropPrefix } from 'fp-ts-std/String'
 *
 * const f = dropPrefix('foo')
 *
 * assert.strictEqual(f('foobar'), 'bar')
 * assert.strictEqual(f('barfoo'), 'barfoo')
 * assert.strictEqual(f('foofoo'), 'foo')
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const dropPrefix = (prefix: string): Endomorphism<string> =>
	when(S.startsWith(prefix))(dropLeft(S.size(prefix)))

/**
 * Drop a suffix if present, else return the input string unmodified.
 *
 * @example
 * import { dropSuffix } from 'fp-ts-std/String'
 *
 * const f = dropSuffix('bar')
 *
 * assert.strictEqual(f('foobar'), 'foo')
 * assert.strictEqual(f('barfoo'), 'barfoo')
 * assert.strictEqual(f('barbar'), 'bar')
 *
 * @category 3 Functions
 * @since 0.18.0
 */
export const dropSuffix = (suffix: string): Endomorphism<string> =>
	when(S.endsWith(suffix))(dropRight(S.size(suffix)))
