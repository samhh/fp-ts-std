/**
 * Various functions to aid in working with JSON.
 *
 * @since 0.1.0
 */

import type { Either } from "fp-ts/Either"
import * as E from "fp-ts/Either"
import type { Json } from "fp-ts/Json"
import type { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import { flow, identity, pipe } from "fp-ts/function"
import { isString } from "fp-ts/string"
import { type Newtype, iso } from "newtype-ts"

type JSONStringSymbol = { readonly JSONString: unique symbol }

/**
 * Newtype representing stringified JSON.
 *
 * @example
 * import { JSONString, stringifyPrimitive } from 'fp-ts-std/JSON'
 *
 * const safeToParse: JSONString = stringifyPrimitive('foo')
 *
 * @category 0 Types
 * @since 0.5.0
 */
export type JSONString = Newtype<JSONStringSymbol, string>

const isoJSONString = iso<JSONString>()

const mkJSONString = isoJSONString.wrap

/**
 * Unwrap a `JSONString` newtype back to its underlying string representation.
 *
 * @category 3 Functions
 * @since 0.6.0
 */
export const unJSONString = isoJSONString.unwrap

/**
 * Stringify some arbitrary data.
 *
 * @example
 * import { stringify } from 'fp-ts-std/JSON'
 * import * as E from 'fp-ts/Either'
 * import { constant } from 'fp-ts/function'
 *
 * const f = stringify(constant('e'))
 *
 * const valid = 'abc'
 * const invalid = () => {}
 *
 * assert.deepStrictEqual(f(valid), E.right('"abc"'))
 * assert.deepStrictEqual(f(invalid), E.left('e'))
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const stringify =
	<E>(f: (e: TypeError) => E) =>
	(x: unknown): Either<E, JSONString> =>
		pipe(
			// It should only throw some sort of `TypeError`:
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
			E.tryCatch(
				() => JSON.stringify(x),
				e => f(e as TypeError),
			),
			E.filterOrElse(isString, () =>
				f(TypeError("Stringify output not a string")),
			),
			E.map(mkJSONString),
		)

/**
 * Stringify some arbitrary data, returning an `Option`.
 *
 * @example
 * import { stringifyO } from 'fp-ts-std/JSON'
 * import * as O from 'fp-ts/Option'
 *
 * const valid = 'abc'
 * const invalid = () => {}
 *
 * assert.deepStrictEqual(stringifyO(valid), O.some('"abc"'))
 * assert.deepStrictEqual(stringifyO(invalid), O.none)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const stringifyO: (data: unknown) => Option<JSONString> = flow(
	stringify(identity),
	O.fromEither,
)

/**
 * Stringify a primitive value with no possibility of failure.
 *
 * @example
 * import { stringifyPrimitive } from 'fp-ts-std/JSON'
 *
 * assert.strictEqual(stringifyPrimitive('abc'), '"abc"')
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const stringifyPrimitive = (
	x: string | number | boolean | null,
): JSONString => pipe(x, JSON.stringify, mkJSONString)

/**
 * Parse a string as JSON. This is safe provided there have been no shenanigans
 * with the `JSONString` newtype.
 *
 * @example
 * import { unstringify, stringifyPrimitive } from 'fp-ts-std/JSON'
 * import { flow } from 'fp-ts/function'
 *
 * const f = flow(stringifyPrimitive, unstringify)
 *
 * assert.strictEqual(f('abc'), 'abc')
 *
 * @category 3 Functions
 * @since 0.5.0
 */
export const unstringify: (x: JSONString) => unknown = flow(
	unJSONString,
	JSON.parse,
)

/**
 * Parse a string as JSON. The `Json` type on the right side comes from `fp-ts`
 * and is a union of all possible parsed types.
 *
 * @example
 * import { parse } from 'fp-ts-std/JSON'
 * import * as E from 'fp-ts/Either'
 * import { constant } from 'fp-ts/function'
 *
 * const f = parse(constant('e'))
 *
 * const valid = '"abc"'
 * const invalid = 'abc'
 *
 * assert.deepStrictEqual(f(valid), E.right('abc'))
 * assert.deepStrictEqual(f(invalid), E.left('e'))
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const parse =
	<E>(f: (e: SyntaxError) => E) =>
	(x: string): Either<E, Json> =>
		// It should only throw some sort of `SyntaxError`:
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
		E.tryCatch(
			() => JSON.parse(x) as Json,
			e => f(e as SyntaxError),
		)

/**
 * Parse a string as JSON, returning an `Option`.
 *
 * @example
 * import { parseO } from 'fp-ts-std/JSON'
 * import * as O from 'fp-ts/Option'
 *
 * const valid = '"abc"'
 * const invalid = 'abc'
 *
 * assert.deepStrictEqual(parseO(valid), O.some('abc'))
 * assert.deepStrictEqual(parseO(invalid), O.none)
 *
 * @category 3 Functions
 * @since 0.1.0
 */
export const parseO: (stringified: string) => Option<unknown> = flow(
	parse(identity),
	O.fromEither,
)
