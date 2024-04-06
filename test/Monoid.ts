import { describe, expect, it } from "@jest/globals"
import fc from "fast-check"
import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import { constant, pipe } from "fp-ts/function"
import * as S from "fp-ts/string"
import { Lazy } from "../src/Lazy"
import { memptyUnless, memptyWhen, toMonoid } from "../src/Monoid"

describe("Monoid", () => {
	describe("toMonoid", () => {
		const f = toMonoid(O.Foldable)(S.Monoid)
		const g = toMonoid(E.Foldable)(S.Monoid)

		it("returns monoidal identity per provided instances", () => {
			expect(f(O.none)).toEqual(S.Monoid.empty)
			expect(g(E.left(null))).toEqual(S.Monoid.empty)
		})

		it("unwraps per provided Foldable instance", () => {
			fc.assert(fc.property(fc.string(), x => pipe(x, O.some, f) === x))
			fc.assert(fc.property(fc.string(), x => pipe(x, E.right, g) === x))
		})
	})

	describe("memptyWhen", () => {
		const f = memptyWhen(S.Monoid)

		it("returns identity element on true condition", () => {
			fc.assert(
				fc.property(fc.string(), x => f(true)(constant(x)) === S.Monoid.empty),
			)
		})

		it("returns identity on argument on false condition", () => {
			fc.assert(fc.property(fc.string(), x => f(false)(constant(x)) === x))
		})

		it("lazily evaluates value", () => {
			let exe = false
			const g: Lazy<string> = () => {
				exe = true
				return "foo"
			}

			f(true)(g)
			expect(exe).toBe(false)

			f(false)(g)
			expect(exe).toBe(true)
		})
	})

	describe("memptyUnless", () => {
		const f = memptyUnless(S.Monoid)

		it("returns identity element on false condition", () => {
			fc.assert(
				fc.property(fc.string(), x => f(false)(constant(x)) === S.Monoid.empty),
			)
		})

		it("returns identity on argument on true condition", () => {
			fc.assert(fc.property(fc.string(), x => f(true)(constant(x)) === x))
		})

		it("lazily evaluates value", () => {
			let exe = false
			const g: Lazy<string> = () => {
				exe = true
				return "foo"
			}

			f(false)(g)
			expect(exe).toBe(false)

			f(true)(g)
			expect(exe).toBe(true)
		})
	})
})
