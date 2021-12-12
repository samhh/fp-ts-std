import fc from "fast-check"
import { pureIf } from "../src/Alternative"
import * as O from "fp-ts/Option"

describe("Alternative", () => {
  describe("pureIf", () => {
    const f = pureIf(O.Alternative)

    it("returns constant empty/zero on false", () => {
      fc.assert(
        fc.property(fc.anything(), x => expect(f(false)(x)).toEqual(O.none)),
      )
    })

    it("returns lifted input on true", () => {
      fc.assert(
        fc.property(fc.anything(), x => expect(f(true)(x)).toEqual(O.some(x))),
      )
    })
  })
})
