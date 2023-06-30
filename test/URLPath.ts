import {
  URLPath,
  isURLPath,
  fromURL,
  fromString,
  fromStringO,
  fromPathname,
  toURL,
  toURLO,
  toString,
  getPathname,
  modifyPathname,
  setPathname,
  getParams,
  modifyParams,
  setParams,
  getHash,
  modifyHash,
  setHash,
} from "../src/URLPath.js"
import fc from "fast-check"
import { constant, flow, identity, pipe } from "fp-ts/function"
import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import { unpack } from "../src/Newtype.js"
import {
  unsafeUnwrap as unsafeUnwrapRight,
  unsafeUnwrapLeft,
} from "../src/Either.js"
import { unsafeUnwrap as unsafeUnwrapO } from "../src/Option.js"
import { setParam } from "../src/URLSearchParams.js"

// Prefer not to export this.
const phonyBase = "https://urlpath.fp-ts-std.samhh.com"

const validBase = "https://samhh.com"
const invalidBase = "samhh.com"

const validPath = "/f/g.h?i=j&k=l&i=m#n"
const invalidPath = "//"

describe("URLPath", () => {
  describe("isURLPath", () => {
    const f = isURLPath

    it("succeeds only for URLs with phony base", () => {
      expect(f("foo")).toBe(false)
      expect(f(new URL(validBase))).toBe(false)
      expect(f(new URL(phonyBase))).toBe(true)
      expect(f(new URL(phonyBase + validPath))).toBe(true)
    })
  })

  describe("fromURL", () => {
    const f = fromURL

    it("retains the path, params, and hash", () => {
      const x = new URL(validBase + validPath)
      const y = pipe(x, f, unpack)

      expect(y.pathname).toEqual(x.pathname)
      expect(y.search).toEqual(x.search)
      expect(y.hash).toEqual(x.hash)
    })
  })

  describe("toURL", () => {
    const f = toURL(identity)

    it("succeeds for valid base URLs", () => {
      const u = pipe("foo", fromPathname, f(validBase), unsafeUnwrapRight)

      expect(u.href).toBe(validBase + "/foo")
    })

    it("passes a TypeError to the callback on failure", () => {
      const e = pipe(
        "foo",
        fromPathname,
        toURL(identity)(invalidBase),
        unsafeUnwrapLeft,
      )

      // This doesn't work. I suspect a tooling bug. Sanity check in the REPL.
      // expect(e).toBeInstanceOf(TypeError)

      expect(e.name).toBe("TypeError")
    })
  })

  describe("toURLO", () => {
    const f = toURLO

    it("succeeds for valid base URLs", () => {
      const u = pipe("foo", fromPathname, f(validBase), unsafeUnwrapO)

      expect(u.href).toBe(validBase + "/foo")
    })

    it("fails for invalid base URLs", () => {
      const x = pipe("foo", fromPathname, f(invalidBase))

      expect(x).toEqual(O.none)
    })
  })

  describe("fromString", () => {
    const f = fromString(constant("e"))

    it("succeeds for valid paths", () => {
      expect(f("")).toEqual(E.right(new URL("", phonyBase)))
      expect(f(validPath)).toEqual(E.right(new URL(validPath, phonyBase)))
    })

    it("passes a TypeError to the callback on failure", () => {
      const e = pipe(invalidPath, fromString(identity), unsafeUnwrapLeft)

      // This doesn't work. I suspect a tooling bug. Sanity check in the REPL.
      // expect(e).toBeInstanceOf(TypeError)

      expect(e.name).toBe("TypeError")
    })
  })

  describe("fromStringO", () => {
    const f = fromStringO

    it("succeeds for valid paths", () => {
      expect(f("")).toEqual(O.some(new URL("", phonyBase)))
      expect(f(validPath)).toEqual(O.some(new URL(validPath, phonyBase)))
    })

    it("fails for invalid paths", () => {
      expect(f(invalidPath)).toEqual(O.none)
    })
  })

  describe("toString", () => {
    const f = toString

    it("returns all concatenated parts", () => {
      const x = "/a/b.c?d=e&f=g&d=h#i"
      const y: URLPath = fromURL(new URL(validBase + x))

      expect(f(y)).toBe(x)
    })
  })

  describe("fromPathname", () => {
    const f = fromPathname

    // Putting aside the prefixed `/`, the pathname setter doesn't seem to
    // encode to the rules of either `encodeURI` or `encodeURIComponent`.
    it("sets encoded path", () => {
      const u = pipe(
        "foo bar?",
        f,
        toURL(identity)(validBase),
        unsafeUnwrapRight,
      )

      expect(u.pathname).toBe("/foo%20bar%3F")
    })

    it("trims relative paths beyond root", () => {
      const g = flow(
        f,
        toURL(identity)(validBase),
        unsafeUnwrapRight,
        x => x.pathname,
      )

      expect(g("/foo/bar/../baz")).toBe("/foo/baz")
      expect(g("/foo/bar/../../baz")).toBe("/baz")
      expect(g("/foo/bar/../../../baz")).toBe("/baz")
      expect(g("/../baz")).toBe("/baz")
      expect(g("./baz")).toBe("/baz")
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

  describe("getPathname", () => {
    const f = getPathname

    it("returns the path", () => {
      const x = "/foo/bar.baz"
      expect(pipe(x, fromPathname, f)).toBe(x)
    })
  })

  describe("setPathname", () => {
    const f = setPathname

    it("sets the path without mutating input", () => {
      const x = fromPathname("foo")
      const y = f("bar")(x)

      expect(getPathname(x)).toBe("/foo")
      expect(getPathname(y)).toBe("/bar")
    })
  })

  describe("modifyPathname", () => {
    const f = modifyPathname

    it("modifies the path with the provided function without mutating input", () => {
      const x = fromPathname("foo")
      const y = f(s => s + "bar")(x)

      expect(getPathname(x)).toBe("/foo")
      expect(getPathname(y)).toBe("/foobar")
    })
  })

  describe("getParams", () => {
    const f = getParams

    it("returns the search params", () => {
      const s = "?a=b&c=d&a=e"
      const r = fromURL(new URL(validBase + s))
      const p = new URLSearchParams(s)

      expect(f(r)).toEqual(p)
    })
  })

  describe("setParams", () => {
    const f = setParams

    it("sets the search params without mutating input", () => {
      const s = "?a=b"
      const p = new URLSearchParams(s)
      const u = new URL(validBase + s)

      const ss = "?c=d"
      const pp = new URLSearchParams(ss)
      const r = pipe(u, fromURL, f(pp))

      expect(u.searchParams).toEqual(p)
      expect(getParams(r)).toEqual(pp)
    })
  })

  describe("modifyParams", () => {
    const f = modifyParams

    it("modifies the search params without mutating input", () => {
      const s = "?a=b&c=d"
      const p = new URLSearchParams(s)
      const u = new URL(validBase + s)

      const pp = new URLSearchParams("?a=e&c=d")
      const r = pipe(u, fromURL, f(setParam("a")("e")))

      expect(u.searchParams).toEqual(p)
      expect(getParams(r)).toEqual(pp)
    })
  })

  describe("getHash", () => {
    const f = getHash

    it("returns the hash", () => {
      const h = "#foo"
      const r = fromURL(new URL(validBase + h))

      expect(f(r)).toBe(h)
    })
  })

  describe("setHash", () => {
    const f = setHash

    it("sets the hash without mutating input", () => {
      const h = "#foo"
      const x = fromURL(new URL(validBase + h))
      const y = f("bar")(x)

      expect(getHash(x)).toBe("#foo")
      expect(getHash(y)).toBe("#bar")
    })
  })

  describe("modifyHash", () => {
    const f = modifyHash

    it("modifies the hash with the provided function without mutating input", () => {
      const h = "#foo"
      const x = fromURL(new URL(validBase + h))
      const y = f(s => s + "bar")(x)

      expect(getHash(x)).toBe("#foo")
      expect(getHash(y)).toBe("#foobar")
    })
  })
})
