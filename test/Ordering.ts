import { describe, expect, it } from "@jest/globals"
import * as Num from "fp-ts/number"
import { EQ, GT, LT } from "../src/Ordering"

describe("Ordering", () => {
	describe("LT", () => {
		it('is equivalent to "less than"', () => {
			expect(Num.Ord.compare(1, 2)).toBe(-1)
			expect(LT).toBe(-1)
		})
	})

	describe("EQ", () => {
		it('is equivalent to "equal to"', () => {
			expect(Num.Ord.compare(1, 1)).toBe(0)
			expect(EQ).toBe(0)
		})
	})

	describe("GT", () => {
		it('is equivalent to "greater than"', () => {
			expect(Num.Ord.compare(2, 1)).toBe(1)
			expect(GT).toBe(1)
		})
	})
})
