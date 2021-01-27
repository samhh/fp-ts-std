import { unsafeUnwrap, unsafeUnwrapLeft } from "../src/Either"
import * as E from "fp-ts/Either"

describe("Either", () => {
  describe("unsafeUnwrap", () => {
    const f = unsafeUnwrap

    it("unwraps Right", () => {
      expect(f(E.right(123))).toBe(123)
    })

    it("throws Left", () => {
      expect(() => f(E.left("l"))).toThrow("l")
    })
  })

  describe("unsafeUnwrapLeft", () => {
    const f = unsafeUnwrapLeft

    it("unwraps Left", () => {
      expect(f(E.left(123))).toBe(123)
    })

    it("throws Right", () => {
      expect(() => f(E.right("r"))).toThrow("r")
    })
  })
})
