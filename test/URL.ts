import { unsafeParse, parse, parseO, isURL } from "../src/URL"
import fc from "fast-check"
import { constant } from "fp-ts/function"
import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"

const validUrl = "https://subdomain.samhh.com/a/b.c"

describe("URL", () => {
  describe("unsafeParse", () => {
    const f = unsafeParse

    it("wraps URL constructor", () => {
      expect(() => f("x")).toThrow()
      expect(f(validUrl)).toEqual(new URL(validUrl))

      fc.assert(fc.property(fc.webUrl(), x => expect(f(x)).toEqual(new URL(x))))
    })
  })

  describe("parse", () => {
    const f = parse(constant("e"))

    it("returns Right for valid URL", () => {
      expect(f(validUrl)).toEqual(E.right(new URL(validUrl)))
    })

    it("returns None for invalid URL", () => {
      expect(f("x")).toEqual(E.left("e"))
    })

    it("never throws", () => {
      fc.assert(
        fc.property(fc.string(), x => {
          // eslint-disable-next-line functional/no-expression-statement
          f(x)
        }),
      )
    })
  })

  describe("parseO", () => {
    const f = parseO

    it("returns Some for valid URL", () => {
      expect(f(validUrl)).toEqual(O.some(new URL(validUrl)))
    })

    it("returns None for invalid URL", () => {
      expect(f("x")).toEqual(O.none)
    })

    it("never throws", () => {
      fc.assert(
        fc.property(fc.string(), x => {
          // eslint-disable-next-line functional/no-expression-statement
          f(x)
        }),
      )
    })
  })

  describe("isURL", () => {
    const f = isURL

    it("works", () => {
      expect(f({})).toBe(false)
      expect(f(unsafeParse("https://samhh.com"))).toBe(true)
    })
  })
})
