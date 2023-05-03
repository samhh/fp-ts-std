import {
  unsafeUnwrap,
  unsafeUnwrapLeft,
  unsafeExpect,
  unsafeExpectLeft,
  mapBoth,
  match2,
  getOrd,
  getEnum,
} from "../src/Either"
import * as E from "fp-ts/Either"
import { identity } from "fp-ts/function"
import * as Str from "../src/String"
import { Show as StrShow, Semigroup as StrSemigroup } from "fp-ts/string"
import fc from "fast-check"
import { curry2 } from "../src/Function"
import * as Num from "fp-ts/number"
import { LT, EQ, GT } from "../src/Ordering"
import { Enum as EnumBool } from "../src/Boolean"
import { universe } from "../src/Enum"

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

  describe("unsafeExpect", () => {
    const f = unsafeExpect(StrShow)

    it("unwraps Right", () => {
      expect(f(E.right(123))).toBe(123)
    })

    it("throws Left via Show", () => {
      expect(() => f(E.left("l"))).toThrow('"l"')
    })
  })

  describe("unsafeExpectLeft", () => {
    const f = unsafeExpectLeft(StrShow)

    it("unwraps Left", () => {
      expect(f(E.left(123))).toBe(123)
    })

    it("throws Right", () => {
      expect(() => f(E.right("r"))).toThrow('"r"')
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

  describe("match2", () => {
    const f = match2

    it("calls appropriate callbacks", () => {
      const concat = curry2(StrSemigroup.concat)

      const g = f<string, string, string, string, string>(
        concat,
        concat,
        concat,
        concat,
      )

      expect(g(E.left("l "))(E.left("l"))).toBe("l l")
      expect(g(E.left("l "))(E.right("r"))).toBe("l r")
      expect(g(E.right("r "))(E.left("l"))).toBe("r l")
      expect(g(E.right("r "))(E.right("r"))).toBe("r r")
    })

    it("is as lazy as possible", () => {
      // eslint-disable-next-line functional/no-let
      let n = 0

      /* eslint-disable functional/no-expression-statements */
      const inc = () => {
        n++
        return () => {
          n++
        }
      }

      expect(n).toBe(0)

      const g = f(inc, inc, inc, inc)
      expect(n).toBe(0)

      const ll = g(E.left(null))
      expect(n).toBe(0)
      ll(E.left(null))
      expect(n).toBe(2)

      const lr = g(E.left(null))
      expect(n).toBe(2)
      lr(E.right(null))
      expect(n).toBe(4)

      const rl = g(E.right(null))
      expect(n).toBe(4)
      rl(E.left(null))
      expect(n).toBe(6)

      const rr = g(E.right(null))
      expect(n).toBe(6)
      rr(E.right(null))
      expect(n).toBe(8)
      /* eslint-enable functional/no-expression-statements */
    })
  })

  describe("getOrd", () => {
    const { compare: f } = getOrd(Num.Ord)(Num.Ord)

    it("considers any Left less than any Right", () => {
      // For reference.
      expect(Num.Ord.compare(1, 2)).toBe(LT)

      fc.assert(
        fc.property(fc.anything(), fc.anything(), (x, y) => {
          /* eslint-disable @typescript-eslint/no-explicit-any */
          expect(f(E.left<any, any>(x), E.right<any, any>(y))).toBe(LT)
          expect(f(E.right<any, any>(x), E.left<any, any>(y))).toBe(GT)
          /* eslint-enable @typescript-eslint/no-explicit-any */
        }),
      )
    })

    it("tests values in same constructors with given Ords", () => {
      expect(f(E.left(1), E.left(2))).toBe(LT)
      expect(f(E.left(1), E.left(1))).toBe(EQ)
      expect(f(E.left(2), E.left(1))).toBe(GT)

      expect(f(E.right(1), E.right(2))).toBe(LT)
      expect(f(E.right(1), E.right(1))).toBe(EQ)
      expect(f(E.right(2), E.right(1))).toBe(GT)
    })
  })

  describe("getEnum", () => {
    const EB = getEnum(EnumBool)(EnumBool)

    it("can build all values in order", () => {
      expect(universe(EB)).toEqual([
        E.left(false),
        E.left(true),
        E.right(false),
        E.right(true),
      ])
    })

    it("cardinality is a + b", () => {
      expect(EB.cardinality()).toBe(4)
    })
  })
})
