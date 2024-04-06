import { describe, expect, it } from "@jest/globals"
import fc from "fast-check"
import * as IO from "fp-ts/IO"
import * as RIO from "fp-ts/ReaderIO"
import { flow, pipe } from "fp-ts/function"
import { asksIO, runReaderIO } from "../src/ReaderIO"
import * as Str from "../src/String"

describe("ReaderIO", () => {
	describe("runReaderIO", () => {
		it("extracts expected IO from a ReaderIO", () => {
			fc.assert(
				fc.property(fc.integer(), n => {
					const extractedIO = pipe(
						RIO.of<string, number>(n),
						runReaderIO("env"),
					)()

					expect(extractedIO).toBe(n)
				}),
			)
		})
	})

	describe("asksIO", () => {
		it("runs action and lifts to a Reader", () => {
			expect(asksIO(flow(Str.prepend("foo"), IO.of))("bar")()).toBe("foobar")
		})
	})
})
