import { unsafeUnwrap, unsafeUnwrapLeft } from "../src/TaskEither"
import * as TE from "fp-ts/TaskEither"

describe("TaskEither", () => {
  describe("unsafeUnwrap", () => {
    const f = unsafeUnwrap

    it("resolves Right", () => {
      return expect(f(TE.right(123))).resolves.toBe(123)
    })

    it("rejects Left", () => {
      return expect(f(TE.left("l"))).rejects.toBe("l")
    })
  })

  describe("unsafeUnwrapLeft", () => {
    const f = unsafeUnwrapLeft

    it("resolves Left", () => {
      return expect(f(TE.left(123))).resolves.toBe(123)
    })

    it("rejects Right", () => {
      return expect(f(TE.right("r"))).rejects.toBe("r")
    })
  })
})
