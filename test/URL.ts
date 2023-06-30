import { clone, unsafeParse, parse, parseO, isURL } from "../src/URL.js"
import fc from "fast-check"
import { constant } from "fp-ts/function"
import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"

const validUrl = "https://a:b@c.d.e:1/f/g.h?i=j&k=l&i=m#n"

describe("URL", () => {
  describe("clone", () => {
    const f = clone

    it("clones to an identical URL", () => {
      const x = unsafeParse(validUrl)

      expect(f(x)).toEqual(x)
      expect(f(x).href).toBe(x.href)
    })

    it("clones without references", () => {
      const x = unsafeParse(validUrl)
      x.pathname = "/foo" // eslint-disable-line
      x.search = "?foo=food&bar=bard&foo=fool" // eslint-disable-line
      const y = f(x)

      expect(x.pathname).toBe("/foo")
      expect(y.pathname).toBe("/foo")
      expect(x.searchParams.getAll("foo")).toEqual(["food", "fool"])
      expect(y.searchParams.getAll("foo")).toEqual(["food", "fool"])

      x.pathname = "/bar" // eslint-disable-line
      x.searchParams.set("foo", "bar2000") // eslint-disable-line

      expect(x.pathname).toBe("/bar")
      expect(y.pathname).toBe("/foo")
      expect(x.searchParams.getAll("foo")).toEqual(["bar2000"])
      expect(y.searchParams.getAll("foo")).toEqual(["food", "fool"])
    })
  })

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
          // eslint-disable-next-line functional/no-expression-statements
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
          // eslint-disable-next-line functional/no-expression-statements
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
