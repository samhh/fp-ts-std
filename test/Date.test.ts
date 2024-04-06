import { describe, expect, it } from "@jest/globals"
import fc from "fast-check"
import * as O from "fp-ts/Option"
import { not } from "fp-ts/Predicate"
import {
	fromMilliseconds,
	getTime,
	isDate,
	isValid,
	mkMilliseconds,
	now,
	parseDate,
	toISOString,
	toUTCString,
	unMilliseconds,
	unsafeParseDate,
} from "../src/Date"

// Beware timezone differences on different machines - don't hardcode any
// valid input/output pairs
const dateMillisInt = fc.integer({ min: 0, max: new Date().getTime() })

describe("Date", () => {
	describe("getTime", () => {
		const f = getTime

		it("wraps prototype method", () => {
			fc.assert(
				fc.property(fc.date(), d => unMilliseconds(f(d)) === d.getTime()),
			)
		})
	})

	describe("toISOString", () => {
		const f = toISOString

		it("wraps prototype method", () => {
			const d = new Date()

			expect(f(d)).toBe(d.toISOString())
		})
	})

	describe("toUTCString", () => {
		const f = toUTCString

		it("wraps prototype method", () => {
			const d = new Date()

			expect(f(d)).toBe(d.toUTCString())
		})
	})

	describe("isDate", () => {
		const f = isDate

		it("returns true for any date", () => {
			expect(f(new Date())).toBe(true)
			expect(f(new Date("invalid"))).toBe(true)

			fc.assert(fc.property(fc.date(), isDate))
		})

		it("returns false for anything else", () => {
			fc.assert(
				fc.property(
					fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.object()),
					not(isDate),
				),
			)
		})
	})

	describe("isValid", () => {
		const f = isValid

		it("works", () => {
			expect(f(new Date())).toBe(true)
			expect(f(new Date("invalid"))).toBe(false)
		})
	})

	describe("unsafeParseDate", () => {
		const f = unsafeParseDate

		it("wraps date constructor", () => {
			fc.assert(
				fc.property(
					fc.oneof(fc.string(), fc.integer()),
					// Invalid dates don't deep equality check in Jest
					x =>
						isValid(f(x))
							? expect(f(x)).toEqual(new Date(x))
							: !isValid(f(x)) && !isValid(new Date(x)),
				),
			)
		})
	})

	describe("parseDate", () => {
		const f = parseDate

		it("wraps date constructor and validates", () => {
			expect(f(Number.NEGATIVE_INFINITY)).toEqual(O.none)
			expect(f(Number.POSITIVE_INFINITY)).toEqual(O.none)
			expect(f("invalid")).toEqual(O.none)

			fc.assert(
				fc.property(dateMillisInt, x =>
					expect(f(x)).toEqual(O.some(new Date(x))),
				),
			)
		})
	})

	describe("fromMilliseconds", () => {
		const f = fromMilliseconds

		it("creates date using underlying number", () => {
			fc.assert(
				fc.property(dateMillisInt, n =>
					expect(f(mkMilliseconds(n)).toISOString()).toBe(
						new Date(n).toISOString(),
					),
				),
			)
		})
	})

	describe("now", () => {
		const f = now

		it("wraps prototype method", () => {
			const a = Date.now()
			const b = unMilliseconds(f())
			const c = Date.now()

			expect(b).toBeGreaterThanOrEqual(a)
			expect(b).toBeLessThanOrEqual(c)
		})
	})
})
