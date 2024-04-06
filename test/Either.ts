import { describe, expect, it } from "@jest/globals"
import fc from "fast-check"
import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import { flow, identity } from "fp-ts/function"
import * as Num from "fp-ts/number"
import { Semigroup as StrSemigroup, Show as StrShow } from "fp-ts/string"
import { Enum as EnumBool } from "../src/Boolean"
import {
	getEnum,
	getOrd,
	mapBoth,
	match2,
	unsafeExpect,
	unsafeExpectLeft,
	unsafeUnwrap,
	unsafeUnwrapLeft,
} from "../src/Either"
import { universe } from "../src/Enum"
import { curry2 } from "../src/Function"
import { Lazy } from "../src/Lazy"
import { EQ, GT, LT } from "../src/Ordering"
import * as Str from "../src/String"

const msgAndCause = (f: Lazy<unknown>): [string, unknown] => {
	try {
		f()
		throw "didn't throw"
	} catch (e) {
		if (!(e instanceof Error)) throw "threw unexpected type"
		return [e.message, e.cause]
	}
}

describe("Either", () => {
	describe("unsafeUnwrap", () => {
		const f = unsafeUnwrap

		it("unwraps Right", () => {
			expect(f(E.right(123))).toBe(123)
		})

		it("throws Left", () => {
			const [m, c] = msgAndCause(() => f(E.left("l")))

			expect(m).toBe("Unwrapped `Left`")
			expect(c).toBe("l")
		})
	})

	describe("unsafeUnwrapLeft", () => {
		const f = unsafeUnwrapLeft

		it("unwraps Left", () => {
			expect(f(E.left(123))).toBe(123)
		})

		it("throws Right", () => {
			const [m, c] = msgAndCause(() => f(E.right("r")))

			expect(m).toBe("Unwrapped `Right`")
			expect(c).toBe("r")
		})
	})

	describe("unsafeExpect", () => {
		const f = unsafeExpect(StrShow)

		it("unwraps Right", () => {
			expect(f(E.right(123))).toBe(123)
		})

		it("throws Left via Show", () => {
			const [m, c] = msgAndCause(() => f(E.left("l")))

			expect(m).toBe("Unwrapped `Left`")
			expect(c).toBe('"l"')
		})
	})

	describe("unsafeExpectLeft", () => {
		const f = unsafeExpectLeft(StrShow)

		it("unwraps Left", () => {
			expect(f(E.left(123))).toBe(123)
		})

		it("throws Right via Show", () => {
			const [m, c] = msgAndCause(() => f(E.right("r")))

			expect(m).toBe("Unwrapped `Right`")
			expect(c).toBe('"r"')
		})
	})

	describe("mapBoth", () => {
		const f = mapBoth

		it("returns identity on identity input", () => {
			fc.assert(
				fc.property(fc.string(), x => {
					expect(f(identity)(E.left(x))).toEqual(E.left(x))
					expect(f(identity)(E.right(x))).toEqual(E.right(x))
				}),
			)
		})

		it("maps both sides", () => {
			const g = Str.append("!")

			fc.assert(
				fc.property(fc.string(), x => {
					expect(f(g)(E.left(x))).toEqual(E.left(g(x)))
					expect(f(g)(E.right(x))).toEqual(E.right(g(x)))
				}),
			)
		})

		it("is equivalent to doubly applied bimap", () => {
			const g = Str.append("!")

			fc.assert(
				fc.property(fc.string(), x => {
					expect(f(g)(E.left(x))).toEqual(E.bimap(g, g)(E.left(x)))
					expect(f(g)(E.right(x))).toEqual(E.bimap(g, g)(E.right(x)))
				}),
			)
		})
	})

	describe("match2", () => {
		const f = match2

		it("calls appropriate callbacks", () => {
			const concat = curry2(StrSemigroup.concat)

			const g = f<string, string, string, string, string>(
				concat,
				concat,
				concat,
				concat,
			)

			expect(g(E.left("l "))(E.left("l"))).toBe("l l")
			expect(g(E.left("l "))(E.right("r"))).toBe("l r")
			expect(g(E.right("r "))(E.left("l"))).toBe("r l")
			expect(g(E.right("r "))(E.right("r"))).toBe("r r")
		})

		it("is as lazy as possible", () => {
			let n = 0

			const inc = () => {
				n++
				return () => {
					n++
				}
			}

			expect(n).toBe(0)

			const g = f(inc, inc, inc, inc)
			expect(n).toBe(0)

			const ll = g(E.left(null))
			expect(n).toBe(0)
			ll(E.left(null))
			expect(n).toBe(2)

			const lr = g(E.left(null))
			expect(n).toBe(2)
			lr(E.right(null))
			expect(n).toBe(4)

			const rl = g(E.right(null))
			expect(n).toBe(4)
			rl(E.left(null))
			expect(n).toBe(6)

			const rr = g(E.right(null))
			expect(n).toBe(6)
			rr(E.right(null))
			expect(n).toBe(8)
		})
	})

	describe("getOrd", () => {
		const { compare: f } = getOrd(Num.Ord)(Num.Ord)

		it("considers any Left less than any Right", () => {
			// For reference.
			expect(Num.Ord.compare(1, 2)).toBe(LT)

			fc.assert(
				fc.property(fc.anything(), fc.anything(), (x, y) => {
					// biome-ignore lint/suspicious/noExplicitAny: Testing.
					expect(f(E.left<any, any>(x), E.right<any, any>(y))).toBe(LT)
					// biome-ignore lint/suspicious/noExplicitAny: Testing.
					expect(f(E.right<any, any>(x), E.left<any, any>(y))).toBe(GT)
				}),
			)
		})

		it("tests values in same constructors with given Ords", () => {
			expect(f(E.left(1), E.left(2))).toBe(LT)
			expect(f(E.left(1), E.left(1))).toBe(EQ)
			expect(f(E.left(2), E.left(1))).toBe(GT)

			expect(f(E.right(1), E.right(2))).toBe(LT)
			expect(f(E.right(1), E.right(1))).toBe(EQ)
			expect(f(E.right(2), E.right(1))).toBe(GT)
		})
	})

	describe("getEnum", () => {
		const EB = getEnum(EnumBool)(EnumBool)

		describe("pred", () => {
			it("retracts succ", () => {
				const f = flow(EB.pred, O.chain(EB.succ), O.chain(EB.pred))
				const g = EB.pred

				expect(f(E.left(false))).toEqual(g(E.left(false)))
				expect(f(E.left(true))).toEqual(g(E.left(true)))
				expect(f(E.right(false))).toEqual(g(E.right(false)))
				expect(f(E.right(true))).toEqual(g(E.right(true)))
			})
		})

		describe("succ", () => {
			it("retracts pred", () => {
				const f = flow(EB.succ, O.chain(EB.pred), O.chain(EB.succ))
				const g = EB.succ

				expect(f(E.left(false))).toEqual(g(E.left(false)))
				expect(f(E.left(true))).toEqual(g(E.left(true)))
				expect(f(E.right(false))).toEqual(g(E.right(false)))
				expect(f(E.right(true))).toEqual(g(E.right(true)))
			})
		})

		describe("fromEnum", () => {
			const f = EB.fromEnum

			it("works", () => {
				expect(f(E.left(false))).toBe(0)
				expect(f(E.left(true))).toBe(1)
				expect(f(E.right(false))).toBe(2)
				expect(f(E.right(true))).toBe(3)
			})
		})

		describe("toEnum", () => {
			const f = EB.toEnum

			it("succeeds for input in range", () => {
				expect(f(0)).toEqual(O.some(E.left(false)))
				expect(f(1)).toEqual(O.some(E.left(true)))
				expect(f(2)).toEqual(O.some(E.right(false)))
				expect(f(3)).toEqual(O.some(E.right(true)))
			})

			it("fails gracefully for invalid input", () => {
				expect(f(-Infinity)).toEqual(O.none)
				expect(f(-1)).toEqual(O.none)
				expect(f(2.5)).toEqual(O.none)
				expect(f(4)).toEqual(O.none)
				expect(f(1e6)).toEqual(O.none)
				expect(f(Infinity)).toEqual(O.none)
				expect(f(NaN)).toEqual(O.none)
			})
		})

		it("can build all values in order", () => {
			expect(universe(EB)).toEqual([
				E.left(false),
				E.left(true),
				E.right(false),
				E.right(true),
			])
		})

		it("cardinality is a + b", () => {
			expect(EB.cardinality()).toBe(4)
			expect(getEnum(EB)(EB).cardinality()).toBe(8)
		})
	})
})
