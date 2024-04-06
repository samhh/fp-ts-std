import { describe, it, expect } from "@jest/globals"
import {
	unsafeUnwrap,
	unsafeExpect,
	noneAs,
	invert,
	toMonoid,
	memptyWhen,
	memptyUnless,
	pureIf,
	altAllBy,
	getBounded,
	getEnum,
	match2,
} from "../src/Option"
import * as O from "fp-ts/Option"
import { Option } from "fp-ts/Option"
import * as S from "fp-ts/string"
import fc from "fast-check"
import { constant, flow, identity, pipe } from "fp-ts/function"
import { Lazy } from "../src/Lazy"
import { Bounded as BoundedBool, Enum as EnumBool } from "../src/Boolean"
import { universe } from "../src/Enum"
import { curry2 } from "../src/Function"

const msgAndCause = (f: Lazy<unknown>): [string, unknown] => {
	/* eslint-disable */
	try {
		f()
		throw "didn't throw"
	} catch (e) {
		if (!(e instanceof Error)) throw "threw unexpected type"
		return [e.message, e.cause]
	}
	/* eslint-enable */
}

const arbOption = <A>(x: fc.Arbitrary<A>): fc.Arbitrary<Option<A>> =>
	fc.oneof(x.map(O.some), fc.constant(O.none))

describe("Option", () => {
	describe("unsafeUnwrap", () => {
		const f = unsafeUnwrap

		it("unwraps Some", () => {
			expect(f(O.some(123))).toBe(123)
		})

		it("throws None", () => {
			const [m, c] = msgAndCause(() => f(O.none))

			expect(m).toBe("Unwrapped `None`")
			expect(c).toBe(undefined)
		})
	})

	describe("unsafeExpect", () => {
		const f = unsafeExpect("foo")

		it("unwraps Some", () => {
			expect(f(O.some(123))).toBe(123)
		})

		it("throws None with provided message", () => {
			const [m, c] = msgAndCause(() => f(O.none))

			expect(m).toBe("Unwrapped `None`")
			expect(c).toBe("foo")
		})
	})

	describe("noneAs", () => {
		const f = noneAs

		it("is identical to standard None constructor at runtime", () => {
			expect(f<unknown>()).toEqual(O.none)
		})
	})

	describe("invert", () => {
		const f = invert(S.Eq)

		it("wraps provided value in Some given a None", () => {
			fc.assert(
				fc.property(fc.string(), x => expect(f(x)(O.none)).toEqual(O.some(x))),
			)
		})

		it("wraps provied value in Some given a Some containing a different value", () => {
			fc.assert(
				fc.property(fc.string(), x =>
					expect(f(x)(O.some(x + "!"))).toEqual(O.some(x)),
				),
			)
		})

		it("returns None given a Some containing an equivalent value", () => {
			fc.assert(
				fc.property(fc.string(), x => expect(f(x)(O.some(x))).toEqual(O.none)),
			)
		})
	})

	describe("toMonoid", () => {
		const f = toMonoid(S.Monoid)

		it("returns monoidal identity on None", () => {
			expect(f(O.none)).toEqual(S.Monoid.empty)
		})

		it("unwraps Some", () => {
			fc.assert(fc.property(fc.string(), x => pipe(x, O.some, f) === x))
		})
	})

	describe("memptyWhen", () => {
		const f = memptyWhen

		it("returns identity element on true condition", () => {
			fc.assert(
				fc.property(arbOption(fc.string()), x =>
					expect(f(true)(constant(x))).toEqual(O.none),
				),
			)
		})

		it("returns identity on argument on false condition", () => {
			fc.assert(
				fc.property(arbOption(fc.string()), x =>
					expect(f(false)(constant(x))).toEqual(x),
				),
			)
		})
	})

	describe("memptyUnless", () => {
		const f = memptyUnless

		it("returns identity element on false condition", () => {
			fc.assert(
				fc.property(arbOption(fc.string()), x =>
					expect(f(false)(constant(x))).toEqual(O.none),
				),
			)
		})

		it("returns identity on argument on true condition", () => {
			fc.assert(
				fc.property(arbOption(fc.string()), x =>
					expect(f(true)(constant(x))).toEqual(x),
				),
			)
		})
	})

	describe("pureIf", () => {
		const f = pureIf

		it("returns constant empty/zero on false", () => {
			fc.assert(
				fc.property(fc.anything(), x =>
					expect(f(false)(constant(x))).toEqual(O.none),
				),
			)
		})

		it("returns lifted input on true", () => {
			fc.assert(
				fc.property(fc.anything(), x =>
					expect(f(true)(constant(x))).toEqual(O.some(x)),
				),
			)
		})
	})

	describe("altAllBy", () => {
		const f = altAllBy

		it("returns constant empty on empty input", () => {
			fc.assert(
				fc.property(fc.anything(), x =>
					expect(f([])(constant(x))).toEqual(O.none),
				),
			)
		})

		it("returns constant empty on all-empty input", () => {
			fc.assert(
				fc.property(fc.anything(), x =>
					expect(
						f([constant(O.none), constant(O.none), constant(O.none)])(
							constant(x),
						),
					).toEqual(O.none),
				),
			)
		})

		it("returns left-most non-empty value", () => {
			fc.assert(
				fc.property(fc.anything(), fc.anything(), fc.anything(), (x, y, z) =>
					expect(
						f([constant(O.none), constant(O.some(x)), constant(O.some(y))])(
							constant(z),
						),
					).toEqual(O.some(x)),
				),
			)
		})

		/* eslint-disable functional/no-expression-statements */
		it("short-circuits", () => {
			let exe = false // eslint-disable-line functional/no-let
			const g: Lazy<O.Option<string>> = () => {
				exe = true
				return O.some("bar")
			}

			expect(f([constant(O.some("foo")), g])("baz")).toEqual(O.some("foo"))
			expect(exe).toBe(false)

			expect(f([g, constant(O.some("foo"))])("baz")).toEqual(O.some("bar"))
			expect(exe).toBe(true)
		})
		/* eslint-enable functional/no-expression-statements */
	})

	describe("getBounded", () => {
		const B = getBounded(BoundedBool)

		it("None is bottom", () => {
			expect(B.bottom).toEqual(O.none)
		})

		it("Some(top) is top", () => {
			expect(B.top).toEqual(O.some(true))
		})
	})

	describe("getEnum", () => {
		const E = getEnum(EnumBool)

		describe("pred", () => {
			it("retracts succ", () => {
				const f = flow(E.pred, O.chain(E.succ), O.chain(E.pred))
				const g = E.pred

				expect(f(O.some(true))).toEqual(g(O.some(true)))
				expect(f(O.some(false))).toEqual(g(O.some(false)))
				expect(f(O.none)).toEqual(g(O.none))
			})
		})

		describe("succ", () => {
			it("retracts pred", () => {
				const f = flow(E.succ, O.chain(E.pred), O.chain(E.succ))
				const g = E.succ

				expect(f(O.some(true))).toEqual(g(O.some(true)))
				expect(f(O.some(false))).toEqual(g(O.some(false)))
				expect(f(O.none)).toEqual(g(O.none))
			})
		})

		describe("fromEnum", () => {
			const f = E.fromEnum

			it("works", () => {
				expect(f(O.none)).toBe(0)
				expect(f(O.some(false))).toBe(1)
				expect(f(O.some(true))).toBe(2)
			})
		})

		describe("toEnum", () => {
			const f = E.toEnum

			it("succeeds for input in range", () => {
				expect(f(0)).toEqual(O.some(O.none))
				expect(f(1)).toEqual(O.some(O.some(false)))
				expect(f(2)).toEqual(O.some(O.some(true)))
			})

			it("fails gracefully for invalid input", () => {
				expect(f(-Infinity)).toEqual(O.none)
				expect(f(-1)).toEqual(O.none)
				expect(f(1.5)).toEqual(O.none)
				expect(f(3)).toEqual(O.none)
				expect(f(1e6)).toEqual(O.none)
				expect(f(Infinity)).toEqual(O.none)
				expect(f(NaN)).toEqual(O.none)
			})
		})

		it("universe mx = (None : (pure <$> universe x))", () => {
			expect(universe(E)).toEqual([O.none, O.some(false), O.some(true)])
		})

		it("cardinality is a + 1", () => {
			expect(E.cardinality()).toBe(3)
			expect(getEnum(E).cardinality()).toBe(4)
		})
	})

	describe("match2", () => {
		const f = match2

		it("calls appropriate callbacks", () => {
			const g = f<string, string, string>(
				constant("none"),
				identity,
				identity,
				curry2(S.Semigroup.concat),
			)

			expect(g(O.none)(O.none)).toBe("none")
			expect(g(O.some("some"))(O.none)).toBe("some")
			expect(g(O.none)(O.some("some"))).toBe("some")
			expect(g(O.some("some "))(O.some("some"))).toBe("some some")
		})

		it("is as lazy as possible", () => {
			// eslint-disable-next-line functional/no-let
			let n = 0

			/* eslint-disable functional/no-expression-statements */
			const inc1 = () => {
				n++
			}

			const inc2 = () => {
				n++
				return inc1
			}

			expect(n).toBe(0)

			const g = f(inc1, inc1, inc1, inc2)
			expect(n).toBe(0)

			g(O.none)(O.none)
			expect(n).toBe(1)

			g(O.some(null))(O.none)
			expect(n).toBe(2)

			g(O.none)(O.some(null))
			expect(n).toBe(3)

			const h = g(O.some(null))
			expect(n).toBe(3)
			h(O.some(null))
			expect(n).toBe(5)
			/* eslint-enable functional/no-expression-statements */
		})
	})
})
