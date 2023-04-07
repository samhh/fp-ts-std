import { runReaderIO } from "../src/ReaderIO"
import * as RIO from "fp-ts/ReaderIO"
import { pipe } from "fp-ts/function"
import fc from "fast-check"

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
})
