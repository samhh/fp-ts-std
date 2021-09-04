import { unsafeUnwrap, noneAs } from "../src/Option"
import * as O from "fp-ts/Option"

describe("Option", () => {
  describe("unsafeUnwrap", () => {
    const f = unsafeUnwrap

    it("unwraps Some", () => {
      expect(f(O.some(123))).toBe(123)
    })

    it("throws None", () => {
      expect(() => f(O.none)).toThrow()
    })
  })

  describe("noneAs", () => {
    const f = noneAs

    it("is identical to standard None constructor at runtime", () => {
      expect(f<unknown>()).toEqual(O.none)
    })
  })
})
