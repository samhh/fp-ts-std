import { afterEach, describe, expect, it } from "@jest/globals"
import * as O from "fp-ts/Option"
import { getParam, getParamNonEmpty } from "../src/Env"

describe("Env", () => {
	const k = "example_key"

	const setEnvWith = (x: string | undefined) => {
		process.env[k] = x
	}

	const resetEnv = () => {
		delete process.env[k]
	}

	afterEach(resetEnv)

	describe("getParam", () => {
		const f = getParam(k)

		it("fails on missing environment variable", () => {
			expect(f()).toEqual(O.none)
		})

		it("succeeds on present environment variable", () => {
			setEnvWith("")
			expect(f()).toEqual(O.some(""))

			setEnvWith("abc")
			expect(f()).toEqual(O.some("abc"))
		})

		it("gets value anew on each call", () => {
			setEnvWith("x")
			expect(f()).toEqual(O.some("x"))

			setEnvWith("y")
			expect(f()).toEqual(O.some("y"))
		})
	})

	describe("getParamNonEmpty", () => {
		const f = getParamNonEmpty(k)

		it("fails on missing environment variable", () => {
			expect(f()).toEqual(O.none)
		})

		it("fails on empty environment variable", () => {
			setEnvWith("")
			expect(f()).toEqual(O.none)
		})

		it("succeeds on non-empty environment variable", () => {
			setEnvWith("abc")
			expect(f()).toEqual(O.some("abc"))
		})

		it("gets value anew on each call", () => {
			setEnvWith("x")
			expect(f()).toEqual(O.some("x"))

			setEnvWith("y")
			expect(f()).toEqual(O.some("y"))
		})
	})
})
