import { unsafeUnwrap, unsafeUnwrapLeft, mapBoth } from "../src/Either"
import * as E from "fp-ts/Either"
import { identity } from "fp-ts/function"
import * as Str from "../src/String"
import fc from "fast-check"

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

  describe("mapBoth", () => {
    const f = mapBoth

    it("returns identity on identity input", () => {
      fc.assert(
        fc.property(fc.string(), x => {
          expect(f(identity)(E.left(x))).toEqual(E.left(x))
          expect(f(identity)(E.right(x))).toEqual(E.right(x))
        }),
      )
    })

    it("maps both sides", () => {
      const g = Str.append("!")

      fc.assert(
        fc.property(fc.string(), x => {
          expect(f(g)(E.left(x))).toEqual(E.left(g(x)))
          expect(f(g)(E.right(x))).toEqual(E.right(g(x)))
        }),
      )
    })

    it("is equivalent to doubly applied bimap", () => {
      const g = Str.append("!")

      fc.assert(
        fc.property(fc.string(), x => {
          expect(f(g)(E.left(x))).toEqual(E.bimap(g, g)(E.left(x)))
          expect(f(g)(E.right(x))).toEqual(E.bimap(g, g)(E.right(x)))
        }),
      )
    })
  })
})
