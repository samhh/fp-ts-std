import {
  add,
  multiply,
  subtract,
  divide,
  increment,
  decrement,
  isValid,
  rem,
} from "../src/Number"
import fc from "fast-check"

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

  describe("rem", () => {
    const f = rem

    it("calculates the remainder", () => {
      expect(f(2)(5.5)).toBe(1.5)
      expect(f(-4)(2)).toBe(2)
      expect(f(5)(-12)).toBe(-2)
    })
  })
})
