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
} from "../src/Number"
import { fromNumber } from "../src/String"
import fc from "fast-check"
import * as O from "fp-ts/Option"

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
      fc.assert(
        fc.property(fc.float(), x =>
          expect(f(fromNumber(x))).toStrictEqual(O.some(x)),
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
})
