import {
  add,
  multiply,
  subtract,
  divide,
  increment,
  decrement,
  isValid,
  rem,
  mod,
  negate,
  fromString,
  floatFromString,
  fromStringWithRadix,
  isFinite,
  toFinite,
  isPositive,
  isNegative,
  isNonNegative,
  isNonPositive,
  EnumInt,
} from "../src/Number"
import { fromNumber } from "../src/String"
import fc from "fast-check"
import * as O from "fp-ts/Option"
import * as Pred from "fp-ts/Predicate"
import { Predicate } from "fp-ts/Predicate"
import { flow } from "fp-ts/function"

describe("Number", () => {
  describe("add", () => {
    it("adds", () => {
      expect(add(5)(-3)).toBe(2)
    })
  })

  describe("multiply", () => {
    it("multiplies", () => {
      expect(multiply(5)(-3)).toBe(-15)
    })
  })

  describe("subtract", () => {
    it("subtracts the first number from the second", () => {
      expect(subtract(5)(7)).toBe(2)
    })
  })

  describe("divide", () => {
    it("divides the second number by the first", () => {
      expect(divide(5)(15)).toBe(3)
    })
  })

  describe("increment", () => {
    const f = increment

    it("increments", () => {
      expect(f(42)).toBe(43)
      expect(f(-42)).toBe(-41)
      expect(f(-0.12)).toBe(0.88)
    })
  })

  describe("decrement", () => {
    const f = decrement

    it("decrements", () => {
      expect(f(42)).toBe(41)
      expect(f(-42)).toBe(-43)
      expect(f(0.12)).toBe(-0.88)
    })
  })

  describe("isValid", () => {
    const f = isValid

    it("returns false for NaN", () => {
      expect(f(NaN)).toBe(false)
    })

    it("returns true for any other number", () => {
      fc.assert(fc.property(fc.integer(), f))
    })
  })

  describe("fromStringWithRadix", () => {
    const f = fromStringWithRadix

    it("returns none for non-number", () => {
      expect(f(16)("xyz")).toBe(O.none)
    })

    it("returns some for integer", () => {
      expect(f(16)("0xF")).toStrictEqual(O.some(15))
    })
  })

  describe("fromString", () => {
    const f = fromString

    it("returns none for non-number", () => {
      expect(f("abc")).toBe(O.none)
    })

    it("returns some for integer", () => {
      expect(f("3")).toStrictEqual(O.some(3))
      fc.assert(
        fc.property(fc.integer(), x =>
          expect(f(fromNumber(x))).toStrictEqual(O.some(x)),
        ),
      )
    })
  })

  describe("floatFromString", () => {
    const f = floatFromString

    it("returns none for non-number", () => {
      expect(f("abc")).toBe(O.none)
    })

    it("returns some for floating point number", () => {
      expect(f("3.3")).toStrictEqual(O.some(3.3))

      // Negative zero isn't reversible below via `fromNumber`.
      const isNegativeZero: Predicate<number> = n => Object.is(n, -0)
      expect(f("0")).toStrictEqual(O.some(0))
      expect(f("-0")).toStrictEqual(O.some(-0))

      fc.assert(
        fc.property(
          fc.float({ noNaN: true }).filter(Pred.not(isNegativeZero)),
          x => expect(f(fromNumber(x))).toStrictEqual(O.some(x)),
        ),
      )
    })
  })

  describe("rem", () => {
    const f = rem

    it("calculates the remainder", () => {
      expect(f(2)(5.5)).toBe(1.5)
      expect(f(-4)(2)).toBe(2)
      expect(f(5)(-12)).toBe(-2)
    })
  })

  describe("mod", () => {
    const f = mod

    it("calculates the modulus", () => {
      expect(f(2)(5.5)).toBe(1.5)
      expect(f(-4)(2)).toBe(-2)
      expect(f(5)(-12)).toBe(3)
    })
  })

  describe("negate", () => {
    const f = negate

    it("negates", () => {
      expect(f(42)).toBe(-42)
      expect(f(-42)).toBe(42)
    })

    it("is reversible", () => {
      fc.assert(fc.property(fc.integer(), n => f(f(n)) === n))
    })
  })

  describe("isFinite", () => {
    const f = isFinite

    it("passes for any non-Infinity number", () => {
      fc.assert(
        fc.property(
          fc.integer({
            min: Number.MIN_SAFE_INTEGER,
            max: Number.MAX_SAFE_INTEGER,
          }),
          f,
        ),
      )
    })

    it("fails for Infinity (positive and negative)", () => {
      expect(f(Infinity)).toBe(false)
      expect(f(-Infinity)).toBe(false)
    })
  })

  describe("toFinite", () => {
    const f = toFinite

    it("returns identity on non-Infinity", () => {
      fc.assert(
        fc.property(
          fc.integer({
            min: Number.MIN_SAFE_INTEGER,
            max: Number.MAX_SAFE_INTEGER,
          }),
          x => f(x) === x,
        ),
      )
    })

    it("converts Infinity to smallest/largest safe integer", () => {
      expect(f(Infinity)).toBe(Number.MAX_SAFE_INTEGER)
      expect(f(-Infinity)).toBe(Number.MIN_SAFE_INTEGER)
    })
  })

  describe("isPositive", () => {
    const f = isPositive

    it("returns true for any number above zero", () => {
      expect(f(0.000001)).toBe(true)
      expect(f(42)).toBe(true)
      expect(f(Infinity)).toBe(true)

      fc.assert(fc.property(fc.integer({ min: 1 }), f))
    })

    it("returns false for zero", () => {
      expect(f(0)).toBe(false)
    })

    it("returns false for any number below zero", () => {
      expect(f(-0.000001)).toBe(false)
      expect(f(-42)).toBe(false)
      expect(f(-Infinity)).toBe(false)

      fc.assert(fc.property(fc.integer({ max: -1 }), Pred.not(f)))
    })
  })

  describe("isNegative", () => {
    const f = isNegative

    it("returns false for any number above zero", () => {
      expect(f(0.000001)).toBe(false)
      expect(f(42)).toBe(false)
      expect(f(Infinity)).toBe(false)

      fc.assert(fc.property(fc.integer({ min: 1 }), Pred.not(f)))
    })

    it("returns false for zero", () => {
      expect(f(0)).toBe(false)
    })

    it("returns true for any number below zero", () => {
      expect(f(-0.000001)).toBe(true)
      expect(f(-42)).toBe(true)
      expect(f(-Infinity)).toBe(true)

      fc.assert(fc.property(fc.integer({ max: -1 }), f))
    })
  })

  describe("isNonNegative", () => {
    const f = isNonNegative

    it("returns true for any number above zero", () => {
      expect(f(0.000001)).toBe(true)
      expect(f(42)).toBe(true)
      expect(f(Infinity)).toBe(true)

      fc.assert(fc.property(fc.integer({ min: 1 }), f))
    })

    it("returns true for zero", () => {
      expect(f(0)).toBe(true)
    })

    it("returns false for any number below zero", () => {
      expect(f(-0.000001)).toBe(false)
      expect(f(-42)).toBe(false)
      expect(f(-Infinity)).toBe(false)

      fc.assert(fc.property(fc.integer({ max: -1 }), Pred.not(f)))
    })
  })

  describe("isNonPositive", () => {
    const f = isNonPositive

    it("returns false for any number above zero", () => {
      expect(f(0.000001)).toBe(false)
      expect(f(42)).toBe(false)
      expect(f(Infinity)).toBe(false)

      fc.assert(fc.property(fc.integer({ min: 1 }), Pred.not(f)))
    })

    it("returns true for zero", () => {
      expect(f(0)).toBe(true)
    })

    it("returns true for any number below zero", () => {
      expect(f(-0.000001)).toBe(true)
      expect(f(-42)).toBe(true)
      expect(f(-Infinity)).toBe(true)

      fc.assert(fc.property(fc.integer({ max: -1 }), f))
    })
  })

  describe("EnumInt", () => {
    describe("succ", () => {
      const f = EnumInt.succ

      it("retracts pred", () => {
        const g = flow(
          EnumInt.pred,
          O.chain(EnumInt.succ),
          O.chain(EnumInt.pred),
        )
        const h = EnumInt.pred

        fc.assert(fc.property(fc.integer(), n => expect(g(n)).toEqual(h(n))))
      })

      it("returns incremented number", () => {
        expect(f(-123)).toEqual(O.some(-122))
        expect(f(0)).toEqual(O.some(1))
        expect(f(123)).toEqual(O.some(124))
      })

      it("rejects number more than or equal to max", () => {
        expect(f(Number.MAX_SAFE_INTEGER)).toEqual(O.none)
        expect(f(Number.MAX_SAFE_INTEGER + 1)).toEqual(O.none)
        expect(f(Infinity)).toEqual(O.none)
      })

      it("rejects float", () => {
        expect(f(-123.5)).toEqual(O.none)
        expect(f(123.5)).toEqual(O.none)
      })
    })

    describe("pred", () => {
      const f = EnumInt.pred

      it("retracts succ", () => {
        const g = flow(
          EnumInt.succ,
          O.chain(EnumInt.pred),
          O.chain(EnumInt.succ),
        )
        const h = EnumInt.succ

        fc.assert(fc.property(fc.integer(), n => expect(g(n)).toEqual(h(n))))
      })

      it("returns decremented number", () => {
        expect(f(-123)).toEqual(O.some(-124))
        expect(f(0)).toEqual(O.some(-1))
        expect(f(123)).toEqual(O.some(122))
      })

      it("rejects number less than or equal to min", () => {
        expect(f(Number.MIN_SAFE_INTEGER)).toEqual(O.none)
        expect(f(Number.MIN_SAFE_INTEGER - 1)).toEqual(O.none)
        expect(f(-Infinity)).toEqual(O.none)
      })

      it("rejects float", () => {
        expect(f(-123.5)).toEqual(O.none)
        expect(f(123.5)).toEqual(O.none)
      })
    })
  })
})
