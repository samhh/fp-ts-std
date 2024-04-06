import { describe, it, expect } from "@jest/globals"
import fc from "fast-check"
import { randomExtract } from "../src/Random"
import { pipe, flow } from "fp-ts/function"
import * as A from "fp-ts/Array"
import * as IO from "fp-ts/IO"
import { decrement } from "../src/Number"
import { fst, snd } from "fp-ts/Tuple"
import { execute } from "../src/IO"
import * as NEA from "fp-ts/NonEmptyArray"
import { NonEmptyArray } from "fp-ts/NonEmptyArray"

describe("Random", () => {
	describe("randomExtract", () => {
		const f = randomExtract

		it("returns predictable output on singleton input", () => {
			fc.assert(
				fc.property(fc.anything(), x => expect(f([x])()).toEqual([x, []])),
			)
		})

		it("returns element of input", () => {
			const xs = NEA.range(1, 10)
			const y = pipe(xs, f, IO.map(fst), execute)
			expect(y >= 1 && y <= 10).toBe(true)
		})

		it("returns array of input size minus one", () => {
			fc.assert(
				fc.property(fc.array(fc.anything(), { minLength: 2 }), xs =>
					expect(
						pipe(
							xs as NonEmptyArray<unknown>,
							f,
							IO.map(flow(snd, A.size)),
							execute,
						),
					).toEqual(pipe(xs, A.size, decrement)),
				),
			)
		})

		it("does not mutate input", () => {
			const xs: NonEmptyArray<number> = [1, 2, 3]
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const _ = f([1, 2, 3])()
			expect(xs).toEqual([1, 2, 3])
		})
	})
})
