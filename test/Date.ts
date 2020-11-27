import {
  getTime,
  toISOString,
  isDate,
  isValid,
  unsafeParseDate,
  parseDate,
  fromMilliseconds,
  now,
  mkMilliseconds,
  unMilliseconds,
} from "../src/Date"
import fc from "fast-check"
import { not } from "fp-ts/function"
import * as O from "fp-ts/Option"

describe("Date", () => {
  describe("getTime", () => {
    const f = getTime

    it("wraps prototype method", () => {
      fc.assert(
        fc.property(fc.date(), d => unMilliseconds(f(d)) === d.getTime()),
      )
    })
  })

  describe("toISOString", () => {
    const f = toISOString

    it("wraps prototype method", () => {
      const d = new Date()

      expect(f(d)).toBe(d.toISOString())
    })
  })

  describe("isDate", () => {
    const f = isDate

    it("returns true for any date", () => {
      expect(f(new Date())).toBe(true)
      expect(f(new Date("invalid"))).toBe(true)

      fc.assert(fc.property(fc.date(), isDate))
    })

    it("returns false for anything else", () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.object()),
          not(isDate),
        ),
      )
    })
  })

  describe("isValid", () => {
    const f = isValid

    it("works", () => {
      expect(f(new Date())).toBe(true)
      expect(f(new Date("invalid"))).toBe(false)
    })
  })

  describe("unsafeParseDate", () => {
    const f = unsafeParseDate

    it("wraps date constructor", () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.string(), fc.integer()),
          // Invalid dates don't deep equality check in Jest
          x =>
            isValid(f(x))
              ? expect(f(x)).toEqual(new Date(x))
              : !isValid(f(x)) && !isValid(new Date(x)),
        ),
      )
    })
  })

  describe("parseDate", () => {
    const f = parseDate

    it("parses numbers", () => {
      expect(f(-Infinity)).toEqual(O.none)
      expect(f(-631152000000)).toEqual(O.some(new Date("1950-01-01")))
      expect(f(0)).toEqual(O.some(new Date("1970-01-01")))
      expect(f(1577836800000)).toEqual(O.some(new Date("2020-01-01")))
      expect(f(Infinity)).toEqual(O.none)
    })

    it("parses strings", () => {
      expect(f("x")).toEqual(O.none)
      expect(f("1")).toEqual(O.some(new Date("2001-01-01")))
      expect(f("1-")).toEqual(O.some(new Date("2001-01-01")))
      expect(f("2020")).toEqual(O.some(new Date("2020-01-01")))
      expect(f("February 3, 4567")).toEqual(O.some(new Date("4567-02-03")))
    })
  })

  describe("fromMilliseconds", () => {
    const f = fromMilliseconds

    it("creates date using underlying number", () => {
      expect(f(mkMilliseconds(1606400902794)).toISOString()).toBe(
        "2020-11-26T14:28:22.794Z",
      )

      fc.assert(
        fc.property(fc.integer(0, new Date("2050-01-01").getTime()), n =>
          expect(f(mkMilliseconds(n)).toISOString()).toBe(
            new Date(n).toISOString(),
          ),
        ),
      )
    })
  })

  describe("now", () => {
    const f = now

    it("wraps prototype method", () => {
      const a = Date.now()
      const b = unMilliseconds(f())
      const c = Date.now()

      expect(b).toBeGreaterThanOrEqual(a)
      expect(b).toBeLessThanOrEqual(c)
    })
  })
})
