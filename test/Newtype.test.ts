import { describe, it, expect } from "@jest/globals"
import fc from "fast-check"
import type { Endomorphism } from "fp-ts/Endomorphism"
import * as O from "fp-ts/Option"
import { type Newtype, iso } from "newtype-ts"
import { over, overF, pack, unpack } from "../src/Newtype"
import { multiply } from "../src/Number"

describe("Newtype", () => {
	type Num = Newtype<{ readonly Num: unique symbol }, number>
	const mkNum: (n: number) => Num = iso<Num>().wrap

	describe("pack & unpack", () => {
		it("are reversible", () => {
			fc.assert(
				fc.property(
					fc.integer(),
					n => unpack(pack<Num>(unpack(pack<Num>(n)))) === n,
				),
			)
		})
	})

	describe("over", () => {
		const f = over

		it("is equivalent to a lifted endomorphism", () => {
			const g: Endomorphism<number> = multiply(2)

			fc.assert(fc.property(fc.integer(), n => f(g)(mkNum(n)) === mkNum(g(n))))
		})
	})

	describe("overF", () => {
		const f = overF(O.Functor)

		it("is equivalent to a lifted Kleisli arrow", () => {
			const g = f<number>(O.fromPredicate(n => n === 42))

			expect(g(mkNum(42))).toEqual(O.some(mkNum(42)))
			expect(g(mkNum(123))).toEqual(O.none)
		})
	})
})
