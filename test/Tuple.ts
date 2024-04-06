import { describe, expect, it } from "@jest/globals"
import fc from "fast-check"
import * as O from "fp-ts/Option"
import { bimap, swap } from "fp-ts/Tuple"
import { constant, flow, identity, pipe } from "fp-ts/function"
import * as Str from "fp-ts/string"
import { Enum as EnumBool } from "../src/Boolean"
import { universe } from "../src/Enum"
import { increment } from "../src/Number"
import { EQ, GT, LT } from "../src/Ordering"
import {
	create,
	dup,
	fanout,
	getEnum,
	getEq,
	getOrd,
	mapBoth,
	toFst,
	toSnd,
	traverseToFst,
	traverseToSnd,
	withFst,
	withSnd,
} from "../src/Tuple"

const nonMaxNumber = fc.integer({ max: Number.MAX_SAFE_INTEGER - 1 })

describe("Tuple", () => {
	describe("dup", () => {
		const f = dup

		it("duplicates the input", () => {
			fc.assert(fc.property(fc.anything(), x => expect(f(x)).toEqual([x, x])))
		})
	})

	describe("toFst", () => {
		const f = toFst
		const g = f(increment)

		it("applies the function and returns both input and output", () => {
			fc.assert(
				fc.property(nonMaxNumber, n => expect(g(n)).toEqual([increment(n), n])),
			)
		})

		it("is the dual of toSnd", () => {
			fc.assert(
				fc.property(nonMaxNumber, n =>
					expect(g(n)).toEqual(pipe(n, toSnd(increment), swap)),
				),
			)
		})
	})

	describe("toSnd", () => {
		const f = toSnd
		const g = f(increment)

		it("applies the function and returns both input and output", () => {
			fc.assert(
				fc.property(nonMaxNumber, n => expect(g(n)).toEqual([n, increment(n)])),
			)
		})

		it("is the dual of toFst", () => {
			fc.assert(
				fc.property(nonMaxNumber, n =>
					expect(g(n)).toEqual(pipe(n, toFst(increment), swap)),
				),
			)
		})
	})

	describe("traverseToFst", () => {
		const f = traverseToFst(O.Functor)

		it("preserves functor's sanctity", () => {
			expect(f(constant(O.none))(123)).toEqual(O.none)
		})

		it("is equivalent to a functorial toFst", () => {
			fc.assert(
				fc.property(nonMaxNumber, n =>
					expect(pipe(n, f(flow(increment, O.some)))).toEqual(
						pipe(n, toFst(increment), O.some),
					),
				),
			)
		})
	})

	describe("traverseToSnd", () => {
		const f = traverseToSnd(O.Functor)

		it("preserves functor's sanctity", () => {
			expect(f(constant(O.none))(123)).toEqual(O.none)
		})

		it("is equivalent to a functorial toSnd", () => {
			fc.assert(
				fc.property(nonMaxNumber, n =>
					expect(pipe(n, f(flow(increment, O.some)))).toEqual(
						pipe(n, toSnd(increment), O.some),
					),
				),
			)
		})
	})

	describe("withFst", () => {
		const f = withFst

		it("constructs a tuple in order of arguments", () => {
			expect(f(1)(2)).toEqual([1, 2])
		})
	})

	describe("withSnd", () => {
		const f = withSnd

		it("constructs a tuple in reverse order of arguments", () => {
			expect(f(1)(2)).toEqual([2, 1])
		})
	})

	describe("create", () => {
		const f = create

		it("is equivalent to identity at runtime", () => {
			fc.assert(
				fc.property(fc.anything(), fc.anything(), (x, y) =>
					expect(f([x, y])).toEqual([x, y]),
				),
			)
		})
	})

	describe("mapBoth", () => {
		const f = mapBoth

		it("returns identity on identity input", () => {
			fc.assert(
				fc.property(fc.string(), fc.string(), (l, r) =>
					expect(f(identity)([l, r])).toEqual([l, r]),
				),
			)
		})

		it("maps both sides", () => {
			const g = O.some

			fc.assert(
				fc.property(fc.string(), fc.string(), (l, r) =>
					expect(f(g)([l, r])).toEqual([g(l), g(r)]),
				),
			)
		})

		it("is equivalent to doubly applied bimap", () => {
			const g = O.some

			fc.assert(
				fc.property(fc.string(), fc.string(), (l, r) =>
					expect(f(g)([l, r])).toEqual(bimap(g, g)([l, r])),
				),
			)
		})
	})

	describe("fanout", () => {
		const f = fanout

		it("calls both provided functions and returns their outputs in order", () => {
			fc.assert(
				fc.property(fc.string(), x =>
					expect(fanout(O.of)(constant("foo"))(x)).toEqual([O.of(x), "foo"]),
				),
			)
			expect(f)
		})
	})

	describe("getEq", () => {
		it("checks both values in terms of AND", () => {
			const { equals: f } = getEq(Str.Eq)(Str.Eq)

			expect(f(["foo", "foo"], ["foo", "foo"])).toBe(true)
			expect(f(["foo", "foo"], ["bar", "foo"])).toBe(false)
			expect(f(["foo", "foo"], ["foo", "bar"])).toBe(false)
			expect(f(["foo", "bar"], ["baz", "oof"])).toBe(false)
		})

		it("checks second component lazily", () => {
			const { equals: f } = getEq(Str.Eq)({
				equals: () => {
					throw "evaluated second component"
				},
			})

			expect(f(["foo", "foo"], ["bar", "foo"])).toBe(false)
		})
	})

	describe("getOrd", () => {
		const { compare: f } = getOrd(Str.Ord)(Str.Ord)

		it("compares first component first", () => {
			expect(f(["foo", "bar"], ["foo", "bar"])).toBe(EQ)
			expect(f(["foo", "bar"], ["abc", "baz"])).toBe(GT)
			expect(f(["foo", "bar"], ["foo", "baz"])).toBe(LT)
		})

		it("compares second component lazily", () => {
			const { compare: f } = getOrd(Str.Ord)({
				...Str.Eq,
				compare: () => {
					throw "evaluated second component"
				},
			})

			expect(f(["foo", "foo"], ["bar", "foo"])).toBe(GT)
		})
	})

	describe("getEnum", () => {
		const E = getEnum(EnumBool)(EnumBool)

		describe("pred", () => {
			it("retracts succ", () => {
				const f = flow(E.pred, O.chain(E.succ), O.chain(E.pred))
				const g = E.pred

				fc.assert(
					fc.property(fc.tuple(fc.boolean(), fc.boolean()), x =>
						expect(f(x)).toEqual(g(x)),
					),
				)
			})
		})

		describe("succ", () => {
			it("retracts pred", () => {
				const f = flow(E.succ, O.chain(E.pred), O.chain(E.succ))
				const g = E.succ

				fc.assert(
					fc.property(fc.tuple(fc.boolean(), fc.boolean()), x =>
						expect(f(x)).toEqual(g(x)),
					),
				)
			})
		})

		describe("fromEnum", () => {
			const f = E.fromEnum

			it("works", () => {
				expect(f([false, false])).toBe(0)
				expect(f([true, false])).toBe(1)
				expect(f([false, true])).toBe(2)
				expect(f([true, true])).toBe(3)
			})
		})

		describe("toEnum", () => {
			const f = E.toEnum

			it("succeeds for input in range", () => {
				expect(f(0)).toEqual(O.some([false, false]))
				expect(f(1)).toEqual(O.some([true, false]))
				expect(f(2)).toEqual(O.some([false, true]))
				expect(f(3)).toEqual(O.some([true, true]))
			})

			it("fails gracefully for invalid input", () => {
				expect(f(Number.NEGATIVE_INFINITY)).toEqual(O.none)
				expect(f(-1)).toEqual(O.none)
				expect(f(2.5)).toEqual(O.none)
				expect(f(4)).toEqual(O.none)
				expect(f(1e6)).toEqual(O.none)
				expect(f(Number.POSITIVE_INFINITY)).toEqual(O.none)
				expect(f(Number.NaN)).toEqual(O.none)
			})
		})

		it("can build all values bottom to top, left to right", () => {
			expect(universe(E)).toEqual([
				[false, false],
				[true, false],
				[false, true],
				[true, true],
			])
		})

		it("cardinality is a * b", () => {
			expect(E.cardinality()).toBe(4)
			expect(getEnum(E)(E).cardinality()).toBe(16)
		})
	})
})
