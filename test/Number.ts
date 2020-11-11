import {
  add,
  multiply,
  subtract,
  divide,
  increment,
  decrement,
} from "../src/Number"

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
})
