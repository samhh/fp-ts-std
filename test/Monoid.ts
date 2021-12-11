import { toMonoid, memptyWhen, memptyUnless } from "../src/Monoid"
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

  describe("memptyWhen", () => {
    const f = memptyWhen(S.Monoid)

    it("returns identity element on true condition", () => {
      fc.assert(fc.property(fc.string(), x => f(true)(x) === S.Monoid.empty))
    })

    it("returns identity on argument on false condition", () => {
      fc.assert(fc.property(fc.string(), x => f(false)(x) === x))
    })
  })

  describe("memptyUnless", () => {
    const f = memptyUnless(S.Monoid)

    it("returns identity element on false condition", () => {
      fc.assert(fc.property(fc.string(), x => f(false)(x) === S.Monoid.empty))
    })

    it("returns identity on argument on true condition", () => {
      fc.assert(fc.property(fc.string(), x => f(true)(x) === x))
    })
  })
})
