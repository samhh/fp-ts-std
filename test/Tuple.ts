import { toFst, toSnd } from "../src/Tuple"
import { increment } from "../src/Number"
import { pipe } from "fp-ts/lib/function"
import { swap } from "fp-ts/lib/Tuple"
import fc from "fast-check"

const nonMaxNumber = fc.integer({ max: Number.MAX_SAFE_INTEGER - 1 })

describe("Tuple", () => {
  describe("toFst", () => {
    const f = toFst
    const g = f(increment)

    it("applies the function and returns both input and output", () => {
      fc.assert(
        fc.property(nonMaxNumber, n => expect(g(n)).toEqual([increment(n), n])),
      )
    })

    it("is the dual of toSnd", () => {
      fc.assert(
        fc.property(nonMaxNumber, n =>
          expect(g(n)).toEqual(pipe(n, toSnd(increment), swap)),
        ),
      )
    })
  })

  describe("toSnd", () => {
    const f = toSnd
    const g = f(increment)

    it("applies the function and returns both input and output", () => {
      fc.assert(
        fc.property(nonMaxNumber, n => expect(g(n)).toEqual([n, increment(n)])),
      )
    })

    it("is the dual of toFst", () => {
      fc.assert(
        fc.property(nonMaxNumber, n =>
          expect(g(n)).toEqual(pipe(n, toFst(increment), swap)),
        ),
      )
    })
  })
})
