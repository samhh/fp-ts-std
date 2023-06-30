import { runReaderIO, asksIO } from "../src/ReaderIO.js"
import * as RIO from "fp-ts/ReaderIO"
import * as IO from "fp-ts/IO"
import { flow, pipe } from "fp-ts/function"
import fc from "fast-check"
import * as Str from "../src/String.js"

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
