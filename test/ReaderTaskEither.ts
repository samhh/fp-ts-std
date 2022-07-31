import { unsafeUnwrap, unsafeUnwrapLeft } from "../src/ReaderTaskEither"
import * as RTE from "fp-ts/ReaderTaskEither"

describe("ReaderTaskEither", () => {
  describe("unsafeUnwrap", () => {
    const f = unsafeUnwrap

    it("resolves Right", () => {
      return expect(f(RTE.right(123))({})).resolves.toBe(123)
    })

    it("rejects Left", () => {
      return expect(f(RTE.left("l"))({})).rejects.toBe("l")
    })
  })

  describe("unsafeUnwrapLeft", () => {
    const f = unsafeUnwrapLeft

    it("resolves Left", () => {
      return expect(f(RTE.left(123))({})).resolves.toBe(123)
    })

    it("rejects Right", () => {
      return expect(f(RTE.right("r"))({})).rejects.toBe("r")
    })
  })
})
