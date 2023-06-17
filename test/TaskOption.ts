import { unsafeUnwrap, unsafeExpect, pass } from "../src/TaskOption"
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

  describe("pass", () => {
    const f = pass

    it("is equivalent to of(undefined)", async () => {
      expect(await unsafeUnwrap(f)).toBe(await unsafeUnwrap(TO.of(undefined)))
    })
  })
})
