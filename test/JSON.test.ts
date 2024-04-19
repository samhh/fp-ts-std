import { describe, expect, it } from "@jest/globals"
import fc from "fast-check"
import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import { constTrue, constant, flow, identity } from "fp-ts/function"
import { isString } from "fp-ts/string"
import {
	type JSONString,
	parse,
	parseO,
	stringify,
	stringifyO,
	stringifyPrimitive,
	unJSONString,
	unstringify,
} from "../src/JSON"

const stringifyPrimitiveUnwrapped = (
	x: Parameters<typeof stringifyPrimitive>[0],
): string => stringifyPrimitive(x) as unknown as string

describe("JSON", () => {
	describe("unJSONString", () => {
		const f = unJSONString

		it("unwraps newtype unmodified", () => {
			expect(f(stringifyPrimitive("foo"))).toBe('"foo"')
		})
	})

	describe("stringifyPrimitive", () => {
		it("never throws", () => {
			fc.assert(
				fc.property(
					fc.oneof(fc.string(), fc.integer(), fc.boolean(), fc.constant(null)),
					x => {
						stringifyPrimitive(x)
					},
				),
			)
		})
	})

	describe("stringify", () => {
		const f = stringify

		it("stringifies primitives", () => {
			expect(f(identity)("abc")).toEqual(E.right('"abc"'))
			expect(f(identity)(123)).toEqual(E.right("123"))
			expect(f(identity)(true)).toEqual(E.right("true"))
			expect(f(identity)(null)).toEqual(E.right("null"))
		})

		it("fails when stringification does not return a string", () => {
			const e = TypeError("Stringify output not a string")
			expect(f(identity)(undefined)).toEqual(E.left(e))

			fc.assert(
				fc.property(
					fc.anything(),
					flow(f(identity), E.fold(constTrue, isString)),
				),
			)
		})

		it("stringifies objects (including arrays)", () => {
			expect(f(identity)({ a: 1, b: ["two"] })).toEqual(
				E.right('{"a":1,"b":["two"]}'),
			)
		})

		it("does not throw what it fails to stringify", () => {
			expect(f(constant("e"))(identity)).toEqual(E.left("e"))
		})
	})

	describe("stringifyO", () => {
		const f = stringifyO

		it("stringifies primitives", () => {
			expect(f("abc")).toEqual(O.some('"abc"'))
			expect(f(123)).toEqual(O.some("123"))
			expect(f(true)).toEqual(O.some("true"))
			expect(f(null)).toEqual(O.some("null"))
		})

		it("fails when stringification does not return a string", () => {
			expect(f(undefined)).toEqual(O.none)

			fc.assert(
				fc.property(fc.anything(), flow(f, O.fold(constTrue, isString))),
			)
		})

		it("stringifies objects (including arrays)", () => {
			expect(f({ a: 1, b: ["two"] })).toEqual(O.some('{"a":1,"b":["two"]}'))
		})

		it("does not throw what it fails to stringify", () => {
			expect(f(identity)).toEqual(O.none)
		})
	})

	describe("unstringify", () => {
		const f = (x: string): unknown => unstringify(x as unknown as JSONString)

		it("parses valid underlying JSON", () => {
			expect(f('{"a":1,"b":["two"]}')).toEqual({ a: 1, b: ["two"] })
		})
	})

	describe("parse", () => {
		const f = parse

		it("parses valid JSON", () => {
			expect(f(identity)('{"a":1,"b":["two"]}')).toEqual(
				E.right({ a: 1, b: ["two"] }),
			)

			fc.assert(
				fc.property(
					fc.oneof(fc.string(), fc.integer(), fc.boolean(), fc.constant(null)),
					flow(stringifyPrimitiveUnwrapped, f(identity), E.isRight),
				),
			)
		})

		it("does not throw what it fails to parse", () => {
			expect(f(constant("e"))("invalid")).toEqual(E.left("e"))
		})
	})

	describe("parseO", () => {
		const f = parseO

		it("parses valid JSON", () => {
			expect(f('{"a":1,"b":["two"]}')).toEqual(O.some({ a: 1, b: ["two"] }))

			fc.assert(
				fc.property(
					fc.oneof(fc.string(), fc.integer(), fc.boolean(), fc.constant(null)),
					flow(stringifyPrimitiveUnwrapped, f, O.isSome),
				),
			)
		})

		it("does not throw what it fails to parse", () => {
			expect(f("invalid")).toEqual(O.none)
		})
	})
})
