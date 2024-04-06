import { describe, it, expect } from "@jest/globals"
import { contramap, Contravariant } from "../src/Show"
import { Show } from "fp-ts/Show"
import { fromNumber } from "../src/String"

describe("Show", () => {
	describe("Contravariant", () => {
		const showExcl: Show<string> = { show: x => x + "!" }

		describe("contramap (standalone)", () => {
			it("maps to provided Show instance", () => {
				const showNumExcl: Show<number> = contramap<number, string>(fromNumber)(
					showExcl,
				)

				expect(showNumExcl.show(123)).toBe("123!")
			})
		})

		describe("contramap (instance)", () => {
			it("maps to provided Show instance", () => {
				const showNumExcl: Show<number> = Contravariant.contramap<
					string,
					number
				>(showExcl, fromNumber)

				expect(showNumExcl.show(123)).toBe("123!")
			})
		})
	})
})
