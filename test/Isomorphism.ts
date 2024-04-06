import { describe, expect, it } from "@jest/globals"
import fc from "fast-check"
import * as laws from "fp-ts-laws"
import * as Eq from "fp-ts/Eq"
import * as Bool from "fp-ts/boolean"
import { flow } from "fp-ts/function"
import { Iso } from "monocle-ts/Iso"
import {
	Isomorphism,
	compose,
	deriveMonoid,
	deriveSemigroup,
	fromIso,
	reverse,
	toIso,
} from "../src/Isomorphism"

describe("Isomorphism", () => {
	type Binary = 0 | 1
	const toBinary = (x: boolean): Binary => (x ? 1 : 0)
	const fromBinary: (x: Binary) => boolean = Boolean
	const isoF: Isomorphism<boolean, Binary> = {
		to: toBinary,
		from: fromBinary,
	}
	const isoM: Iso<boolean, Binary> = {
		get: toBinary,
		reverseGet: fromBinary,
	}

	describe("toIso", () => {
		it("performs simple key transformation", () => {
			expect(toIso(isoF)).toEqual(isoM)
		})
	})

	describe("fromIso", () => {
		it("performs simple key transformation", () => {
			expect(fromIso(isoM)).toEqual(isoF)
		})
	})

	describe("reverse", () => {
		it("performs simple key transformation", () => {
			expect(reverse(isoF)).toEqual({
				to: fromBinary,
				from: toBinary,
			})
		})
	})

	describe("deriveSemigroup", () => {
		const f = deriveSemigroup

		it("uses provided Semigroup instance", () => {
			const SAll = f(isoF)(Bool.SemigroupAll)
			expect(SAll.concat(0, 0)).toBe(0)
			expect(SAll.concat(0, 1)).toBe(0)
			expect(SAll.concat(1, 0)).toBe(0)
			expect(SAll.concat(1, 1)).toBe(1)

			const SAny = f(isoF)(Bool.SemigroupAny)
			expect(SAny.concat(0, 0)).toBe(0)
			expect(SAny.concat(0, 1)).toBe(1)
			expect(SAny.concat(1, 0)).toBe(1)
			expect(SAny.concat(1, 1)).toBe(1)
		})

		it("provides lawful output given lawful input", () => {
			laws.semigroup(
				f(isoF)(Bool.SemigroupAll),
				Eq.contramap(isoF.from)(Bool.Eq),
				fc.boolean().map(isoF.to),
			)
		})
	})

	describe("deriveMonoid", () => {
		const f = deriveMonoid

		it("uses provided Monoid instance", () => {
			const MAll = f(isoF)(Bool.MonoidAll)
			expect(MAll.empty).toBe(1)
			expect(MAll.concat(0, 0)).toBe(0)
			expect(MAll.concat(0, 1)).toBe(0)
			expect(MAll.concat(1, 0)).toBe(0)
			expect(MAll.concat(1, 1)).toBe(1)

			const MAny = f(isoF)(Bool.MonoidAny)
			expect(MAny.empty).toBe(0)
			expect(MAny.concat(0, 0)).toBe(0)
			expect(MAny.concat(0, 1)).toBe(1)
			expect(MAny.concat(1, 0)).toBe(1)
			expect(MAny.concat(1, 1)).toBe(1)
		})

		it("provides lawful output given lawful input", () => {
			laws.monoid(
				f(isoF)(Bool.MonoidAll),
				Eq.contramap(isoF.from)(Bool.Eq),
				fc.boolean().map(isoF.to),
			)
		})
	})

	describe("compose", () => {
		// None of this is isomorphic but it proves the property we're testing.
		const f: (x: boolean) => number = Number
		const g: (x: number) => string = String
		const absurd = (): never => {
			// eslint-disable-next-line functional/no-throw-statements
			throw Error("unreachable")
		}

		it('"to" mirrors lifted function composition', () => {
			// Sanity check
			expect(
				compose({ to: f, from: absurd })({ to: g, from: absurd }).to(true),
			).toBe("1")

			expect(flow(f, g)(true)).toBe(
				compose({ to: f, from: absurd })({ to: g, from: absurd }).to(true),
			)
			expect(flow(f, g)(false)).toBe(
				compose({ to: f, from: absurd })({ to: g, from: absurd }).to(false),
			)
		})

		it('"from" mirrors reversed lifted function composition', () => {
			// Sanity check
			expect(
				compose({ to: absurd, from: g })({ to: absurd, from: f }).from(false),
			).toBe("0")

			expect(flow(f, g)(true)).toBe(
				compose({ to: absurd, from: g })({ to: absurd, from: f }).from(true),
			)
			expect(flow(f, g)(false)).toBe(
				compose({ to: absurd, from: g })({ to: absurd, from: f }).from(false),
			)
		})
	})
})
