import { unsafeUnwrap } from "../src/TaskOption"
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
})
