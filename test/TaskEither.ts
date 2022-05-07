import { mapBoth, unsafeUnwrap, unsafeUnwrapLeft } from "../src/TaskEither"
import * as TE from "fp-ts/TaskEither"
import * as E from "fp-ts/Either"
import { identity } from "fp-ts/function"
import * as Str from "../src/String"
import fc from "fast-check"

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

  describe("mapBoth", () => {
    const f = mapBoth

    it("returns identity on identity input", async () => {
      await fc.assert(
        fc.asyncProperty(fc.string(), async x => {
          await expect(f(identity)(TE.left(x))()).resolves.toEqual(E.left(x))
          await expect(f(identity)(TE.right(x))()).resolves.toEqual(E.right(x))
        }),
      )
    })

    it("maps both sides of a tuple", async () => {
      const g = Str.append("!")

      await fc.assert(
        fc.asyncProperty(fc.string(), async x => {
          await expect(f(g)(TE.left(x))()).resolves.toEqual(E.left(g(x)))
          await expect(f(g)(TE.right(x))()).resolves.toEqual(E.right(g(x)))
        }),
      )
    })

    it("is equivalent to doubly applied bimap", async () => {
      const g = Str.append("!")

      await fc.assert(
        fc.asyncProperty(fc.string(), async x => {
          await expect(f(g)(TE.left(x))()).resolves.toEqual(
            E.bimap(g, g)(E.left(x)),
          )
          await expect(f(g)(TE.right(x))()).resolves.toEqual(
            E.bimap(g, g)(E.right(x)),
          )
        }),
      )
    })
  })
})
