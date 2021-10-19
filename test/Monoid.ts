import { toMonoid } from "../src/Monoid"
import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import * as S from "fp-ts/string"
import fc from "fast-check"
import { pipe } from "fp-ts/function"

describe("Monoid", () => {
  describe("toMonoid", () => {
    const f = toMonoid(O.Foldable)(S.Monoid)
    const g = toMonoid(E.Foldable)(S.Monoid)

    it("returns monoidal identity per provided instances", () => {
      expect(f(O.none)).toEqual(S.Monoid.empty)
      expect(g(E.left(null))).toEqual(S.Monoid.empty)
    })

    it("unwraps per provided Foldable instance", () => {
      fc.assert(fc.property(fc.string(), x => pipe(x, O.some, f) === x))
      fc.assert(fc.property(fc.string(), x => pipe(x, E.right, g) === x))
    })
  })
})
