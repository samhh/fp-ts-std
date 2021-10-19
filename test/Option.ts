import { unsafeUnwrap, noneAs, invert, toMonoid } from "../src/Option"
import * as O from "fp-ts/Option"
import * as S from "fp-ts/string"
import fc from "fast-check"
import { pipe } from "fp-ts/function"

describe("Option", () => {
  describe("unsafeUnwrap", () => {
    const f = unsafeUnwrap

    it("unwraps Some", () => {
      expect(f(O.some(123))).toBe(123)
    })

    it("throws None", () => {
      expect(() => f(O.none)).toThrow()
    })
  })

  describe("noneAs", () => {
    const f = noneAs

    it("is identical to standard None constructor at runtime", () => {
      expect(f<unknown>()).toEqual(O.none)
    })
  })

  describe("invert", () => {
    const f = invert(S.Eq)

    it("wraps provided value in Some given a None", () => {
      fc.assert(
        fc.property(fc.string(), x => expect(f(x)(O.none)).toEqual(O.some(x))),
      )
    })

    it("wraps provied value in Some given a Some containing a different value", () => {
      fc.assert(
        fc.property(fc.string(), x =>
          expect(f(x)(O.some(x + "!"))).toEqual(O.some(x)),
        ),
      )
    })

    it("returns None given a Some containing an equivalent value", () => {
      fc.assert(
        fc.property(fc.string(), x => expect(f(x)(O.some(x))).toEqual(O.none)),
      )
    })
  })

  describe("toMonoid", () => {
    const f = toMonoid(S.Monoid)

    it("returns monoidal identity on None", () => {
      expect(f(O.none)).toEqual(S.Monoid.empty)
    })

    it("unwraps Some", () => {
      fc.assert(fc.property(fc.string(), x => pipe(x, O.some, f) === x))
    })
  })
})
