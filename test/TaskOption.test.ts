import { describe, expect, it } from "@jest/globals"
import * as TO from "fp-ts/TaskOption"
import { pass, unsafeExpect, unsafeUnwrap } from "../src/TaskOption"

describe("TaskOption", () => {
	describe("unsafeUnwrap", () => {
		const f = unsafeUnwrap

		it("unwraps Some", () => {
			return expect(f(TO.some(123))).resolves.toBe(123)
		})

		it("throws None", async () => {
			expect(f(TO.none)).rejects.toThrow(new Error("Unwrapped `None`"))
		})
	})

	describe("unsafeExpect", () => {
		const f = unsafeExpect("foo")

		it("unwraps Some", () => {
			return expect(f(TO.some(123))).resolves.toBe(123)
		})

		it("throws None with provided message", async () => {
			expect(f(TO.none)).rejects.toThrow(
				new Error("Unwrapped `None`", { cause: new Error("foo") }),
			)
		})
	})

	describe("pass", () => {
		const f = pass

		it("is equivalent to of(undefined)", async () => {
			expect(await unsafeUnwrap(f)).toBe(await unsafeUnwrap(TO.of(undefined)))
		})
	})
})
