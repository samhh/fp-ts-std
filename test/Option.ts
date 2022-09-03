import {
  unsafeUnwrap,
  noneAs,
  invert,
  toMonoid,
  memptyWhen,
  memptyUnless,
  pureIf,
} from "../src/Option"
import * as O from "fp-ts/Option"
import { Option } from "fp-ts/Option"
import * as S from "fp-ts/string"
import fc from "fast-check"
import { constant, pipe } from "fp-ts/function"

const arbOption = <A>(x: fc.Arbitrary<A>): fc.Arbitrary<Option<A>> =>
  fc.oneof(x.map(O.some), fc.constant(O.none))

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

  describe("memptyWhen", () => {
    const f = memptyWhen

    it("returns identity element on true condition", () => {
      fc.assert(
        fc.property(arbOption(fc.string()), x =>
          expect(f(true)(constant(x))).toEqual(O.none),
        ),
      )
    })

    it("returns identity on argument on false condition", () => {
      fc.assert(
        fc.property(arbOption(fc.string()), x =>
          expect(f(false)(constant(x))).toEqual(x),
        ),
      )
    })
  })

  describe("memptyUnless", () => {
    const f = memptyUnless

    it("returns identity element on false condition", () => {
      fc.assert(
        fc.property(arbOption(fc.string()), x =>
          expect(f(false)(constant(x))).toEqual(O.none),
        ),
      )
    })

    it("returns identity on argument on true condition", () => {
      fc.assert(
        fc.property(arbOption(fc.string()), x =>
          expect(f(true)(constant(x))).toEqual(x),
        ),
      )
    })
  })

  describe("pureIf", () => {
    const f = pureIf

    it("returns constant empty/zero on false", () => {
      fc.assert(
        fc.property(fc.anything(), x =>
          expect(f(false)(constant(x))).toEqual(O.none),
        ),
      )
    })

    it("returns lifted input on true", () => {
      fc.assert(
        fc.property(fc.anything(), x =>
          expect(f(true)(constant(x))).toEqual(O.some(x)),
        ),
      )
    })
  })
})
