import { describe, expect, it } from "@jest/globals"
import fc from "fast-check"
import * as laws from "fp-ts-laws"
import { Predicate, not } from "fp-ts/Predicate"
import * as Pred from "fp-ts/Predicate"
import { flow, pipe } from "fp-ts/function"
import {
	includes as _includes,
	isEmpty as _isEmpty,
	size as _size,
	split as _split,
	toLowerCase as _toLowerCase,
	toUpperCase as _toUpperCase,
} from "fp-ts/string"
import {
	Eq,
	NonEmptyString,
	Ord,
	Semigroup,
	append,
	fromNumber,
	head,
	includes,
	last,
	prepend,
	reverse,
	size,
	split,
	surround,
	toLowerCase,
	toUpperCase,
	unNonEmptyString,
	unsafeFromString,
} from "../src/NonEmptyString"
import { unsafeUnwrap } from "../src/Option"
import * as Str from "../src/String"

const arb = fc.string({ minLength: 1 }).map(unsafeFromString)

const isValid: Predicate<NonEmptyString> = Pred.contramap(unNonEmptyString)(
	not(_isEmpty),
)

describe("NonEmptyString", () => {
	describe("Eq", () => {
		it("is lawful", () => {
			laws.eq(Eq, arb)
		})
	})

	describe("Ord", () => {
		it("is lawful", () => {
			laws.ord(Ord, arb)
		})
	})

	describe("Semigroup", () => {
		it("is lawful", () => {
			laws.semigroup(Semigroup, Eq, arb)
		})
	})

	describe("fromNumber", () => {
		const f = fromNumber

		it("is equivalent to lifted Str.fromNumber", () => {
			fc.assert(
				fc.property(
					fc.integer(),
					n => Str.fromNumber(n) === unNonEmptyString(f(n)),
				),
			)
		})

		it("maintains newtype contract", () => {
			fc.assert(fc.property(fc.integer(), flow(f, isValid)))
		})
	})

	describe("append", () => {
		const f = append

		it("is equivalent to lifted Str.append", () => {
			fc.assert(
				fc.property(
					fc.string(),
					arb,
					(x, y) =>
						Str.append(x)(unNonEmptyString(y)) === unNonEmptyString(f(x)(y)),
				),
			)
		})

		it("maintains newtype contract", () => {
			fc.assert(fc.property(fc.string(), arb, (x, y) => pipe(y, f(x), isValid)))
		})
	})

	describe("prepend", () => {
		const f = prepend

		it("is equivalent to lifted Str.prepend", () => {
			fc.assert(
				fc.property(
					fc.string(),
					arb,
					(x, y) =>
						Str.prepend(x)(unNonEmptyString(y)) === unNonEmptyString(f(x)(y)),
				),
			)
		})

		it("maintains newtype contract", () => {
			fc.assert(fc.property(fc.string(), arb, (x, y) => pipe(y, f(x), isValid)))
		})
	})

	describe("surround", () => {
		const f = surround

		it("is equivalent to lifted Str.surround", () => {
			fc.assert(
				fc.property(
					fc.string(),
					arb,
					(x, y) =>
						Str.surround(x)(unNonEmptyString(y)) === unNonEmptyString(f(x)(y)),
				),
			)
		})

		it("maintains newtype contract", () => {
			fc.assert(fc.property(fc.string(), arb, (x, y) => pipe(y, f(x), isValid)))
		})
	})

	describe("toUpperCase", () => {
		const f = toUpperCase

		it("is equivalent to lifted Str.toUpperCase", () => {
			fc.assert(
				fc.property(
					arb,
					x => _toUpperCase(unNonEmptyString(x)) === unNonEmptyString(f(x)),
				),
			)
		})

		it("maintains newtype contract", () => {
			fc.assert(fc.property(arb, flow(f, isValid)))
		})
	})

	describe("toLowerCase", () => {
		const f = toLowerCase

		it("is equivalent to lifted Str.toLowerCase", () => {
			fc.assert(
				fc.property(
					arb,
					x => _toLowerCase(unNonEmptyString(x)) === unNonEmptyString(f(x)),
				),
			)
		})

		it("maintains newtype contract", () => {
			fc.assert(fc.property(arb, flow(f, isValid)))
		})
	})

	describe("reverse", () => {
		const f = reverse

		it("is equivalent to lifted Str.reverse", () => {
			fc.assert(
				fc.property(
					arb,
					x => Str.reverse(unNonEmptyString(x)) === unNonEmptyString(f(x)),
				),
			)
		})

		it("maintains newtype contract", () => {
			fc.assert(fc.property(arb, flow(f, isValid)))
		})
	})

	describe("head", () => {
		const f = head

		it("is equivalent to lifted infallible Str.head", () => {
			fc.assert(
				fc.property(
					arb,
					x =>
						unsafeUnwrap(Str.head(unNonEmptyString(x))) ===
						unNonEmptyString(f(x)),
				),
			)
		})

		it("maintains newtype contract", () => {
			fc.assert(fc.property(arb, flow(f, isValid)))
		})
	})

	describe("last", () => {
		const f = last

		it("is equivalent to lifted infallible Str.last", () => {
			fc.assert(
				fc.property(
					arb,
					x =>
						unsafeUnwrap(Str.last(unNonEmptyString(x))) ===
						unNonEmptyString(f(x)),
				),
			)
		})

		it("maintains newtype contract", () => {
			fc.assert(fc.property(arb, flow(f, isValid)))
		})
	})

	describe("size", () => {
		const f = size

		it("is equivalent to lifted Str.size", () => {
			fc.assert(fc.property(arb, x => _size(unNonEmptyString(x)) === f(x)))
		})
	})

	describe("includes", () => {
		const f = includes

		it("is equivalent to lifted Str.includes", () => {
			fc.assert(
				fc.property(
					arb,
					fc.string(),
					(haystack, needle) =>
						_includes(needle)(unNonEmptyString(haystack)) ===
						f(needle)(haystack),
				),
			)
		})
	})

	describe("split", () => {
		const f = split
		const sep = " "

		it("is equivalent to lifted Str.split", () => {
			fc.assert(
				fc.property(fc.lorem({ mode: "words" }).map(unsafeFromString), x =>
					expect(f(sep)(x)).toEqual(_split(sep)(unNonEmptyString(x))),
				),
			)
		})
	})
})
