import { describe, it, expect } from "@jest/globals"
import { constFalse, constTrue } from "fp-ts/function"
import { allPass, anyPass, nonePass } from "../src/Predicate"

describe("Predicate", () => {
	describe("allPass", () => {
		const f = allPass

		it("returns true if all predicates succeed", () => {
			expect(f([constTrue, constTrue, constTrue])(null)).toBe(true)
		})

		it("returns false if any predicate fails", () => {
			expect(f([constTrue, constFalse, constTrue])(null)).toBe(false)
		})
	})

	describe("anyPass", () => {
		const f = anyPass

		it("returns true if any predicate succeeds", () => {
			expect(f([constFalse, constTrue, constFalse])(null)).toBe(true)
		})

		it("returns false if all predicates fail", () => {
			expect(f([constFalse, constFalse, constFalse])(null)).toBe(false)
		})
	})

	describe("nonePass", () => {
		const f = nonePass

		it("returns true if all predicates fail", () => {
			expect(f([constFalse, constFalse, constFalse])(null)).toBe(true)
		})

		it("returns false if any predicate succeeds", () => {
			expect(f([constFalse, constTrue, constFalse])(null)).toBe(false)
		})
	})
})
