import { unsafeUnwrap, unsafeExpect } from "../src/IOOption"
import * as IOO from "fp-ts/IOOption"

describe("IOEither", () => {
  describe("unsafeUnwrap", () => {
    const f = unsafeUnwrap

    it("unwraps Some", () => {
      expect(f(IOO.some(123))).toBe(123)
    })

    it("throws None", () => {
      expect(() => f(IOO.none)).toThrow()
    })
  })

  describe("unsafeExpect", () => {
    const f = unsafeExpect("foo")

    it("unwraps Some", () => {
      expect(f(IOO.some(123))).toBe(123)
    })

    it("throws None with provided message", () => {
      expect(() => f(IOO.none)).toThrow("foo")
    })
  })
})
