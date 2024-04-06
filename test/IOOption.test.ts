import { describe, expect, it } from "@jest/globals"
import * as IOO from "fp-ts/IOOption"
import { pass, unsafeExpect, unsafeUnwrap } from "../src/IOOption"

describe("IOOption", () => {
	describe("unsafeUnwrap", () => {
		const f = unsafeUnwrap

		it("unwraps Some", () => {
			expect(f(IOO.some(123))).toBe(123)
		})

		it("throws None", () => {
			expect(() => f(IOO.none)).toThrow(new Error("Unwrapped `None`"))
		})
	})

	describe("unsafeExpect", () => {
		const f = unsafeExpect("foo")

		it("unwraps Some", () => {
			expect(f(IOO.some(123))).toBe(123)
		})

		it("throws None with provided message", () => {
			expect(() => f(IOO.none)).toThrow(
				new Error("Unwrapped `None`", { cause: new Error("foo") }),
			)
		})
	})

	describe("pass", () => {
		const f = pass

		it("is equivalent to of(undefined)", () => {
			expect(unsafeUnwrap(f)).toBe(unsafeUnwrap(IOO.of(undefined)))
		})
	})
})
