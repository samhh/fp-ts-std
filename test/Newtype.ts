import { describe, it } from "@jest/globals"
import fc from "fast-check"
import { Endomorphism } from "fp-ts/Endomorphism"
import { Newtype, iso } from "newtype-ts"
import { over, pack, unpack } from "../src/Newtype"
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
})
