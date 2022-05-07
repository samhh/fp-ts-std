import { mapBoth } from "../src/Bifunctor"
import * as Tuple from "fp-ts/Tuple"
import * as E from "fp-ts/Either"
import * as Str from "../src/String"
import fc from "fast-check"
import { identity } from "fp-ts/function"

describe("Bifunctor", () => {
  describe("mapBoth", () => {
    const f = mapBoth(Tuple.Bifunctor)
    const g = mapBoth(E.Bifunctor)

    it("returns identity given identity function", () => {
      fc.assert(
        fc.property(fc.string(), fc.string(), (l, r) => {
          expect(f(identity)([l, r])).toEqual([l, r])
          expect(g(identity)(E.left(l))).toEqual(E.left(l))
          expect(g(identity)(E.right(r))).toEqual(E.right(r))
        }),
      )
    })

    it("maps both sides", () => {
      const h = Str.isAlphaNum

      fc.assert(
        fc.property(fc.string(), fc.string(), (l, r) => {
          expect(f(h)([l, r])).toEqual([h(l), h(r)])
          expect(g(h)(E.left(l))).toEqual(E.left(h(l)))
          expect(g(h)(E.right(r))).toEqual(E.right(h(r)))
        }),
      )
    })

    it("is equivalent to doubly applied bimap", () => {
      const h = Str.isAlphaNum

      fc.assert(
        fc.property(fc.string(), fc.string(), (l, r) => {
          expect(f(h)([l, r])).toEqual(Tuple.bimap(h, h)([l, r]))
          expect(g(h)(E.left(l))).toEqual(E.bimap(h, h)(E.left(l)))
          expect(g(h)(E.right(r))).toEqual(E.bimap(h, h)(E.right(r)))
        }),
      )
    })
  })
})
