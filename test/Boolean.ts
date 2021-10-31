import {
  invert,
  and,
  or,
  xor,
} from "../src/Boolean"

describe("Boolean", () => {
  describe("invert", () => {
    const f = invert

    it("inverts", () => {
      expect(f(true)).toBe(false)
      expect(f(false)).toBe(true)
    })
  })

  describe("and", () => {
    const f = and

    it("returns true for both true", () => {
      expect(f(true)(true)).toBe(true)
    })

    it("returns false for anything else", () => {
      expect(f(true)(false)).toBe(false)
      expect(f(false)(true)).toBe(false)
      expect(f(false)(false)).toBe(false)
    })
  })

  describe("or", () => {
    const f = or

    it("returns false for both false", () => {
      expect(f(false)(false)).toBe(false)
    })

    it("returns true for anything else", () => {
      expect(f(true)(true)).toBe(true)
      expect(f(true)(false)).toBe(true)
      expect(f(false)(true)).toBe(true)
    })
  })

  describe("xor", () => {
    const f = xor

    it("returns true for one true and one false", () => {
      expect(f(true)(false)).toBe(true)
      expect(f(false)(true)).toBe(true)
    })

    it("returns false for anything else", () => {
      expect(f(true)(true)).toBe(false)
      expect(f(false)(false)).toBe(false)
    })
  })
})
