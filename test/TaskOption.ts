import { unsafeUnwrap, unsafeExpect } from "../src/TaskOption"
import * as TO from "fp-ts/TaskOption"

describe("TaskOption", () => {
  describe("unsafeUnwrap", () => {
    const f = unsafeUnwrap

    it("unwraps Some", () => {
      return expect(f(TO.some(123))).resolves.toBe(123)
    })

    it("throws None", () => {
      expect(() => f(TO.none)).rejects
    })
  })

  describe("unsafeExpect", () => {
    const f = unsafeExpect("foo")

    it("unwraps Some", () => {
      return expect(f(TO.some(123))).resolves.toBe(123)
    })

    it("throws None with provided message", () => {
      return expect(() => f(TO.none)).rejects.toBe("foo")
    })
  })
})
