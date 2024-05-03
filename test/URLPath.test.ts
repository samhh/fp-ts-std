import { describe, expect, it } from "@jest/globals"
import fc from "fast-check"
import * as laws from "fp-ts-laws"
import { apply, flow, pipe } from "fp-ts/function"
import * as Fn from "../src/Function"
import { unpack } from "../src/Newtype"
import { unsafeParse as unsafeParseURL } from "../src/URL"
import {
	Eq,
	type URLPath,
	clone,
	fromPathname,
	fromString,
	fromURL,
	getHash,
	getParams,
	getPathname,
	isURLPath,
	modifyHash,
	modifyParams,
	modifyPathname,
	setHash,
	setParams,
	setPathname,
	toString,
	toURL,
} from "../src/URLPath"
import * as Params from "../src/URLSearchParams"

const arb: fc.Arbitrary<URLPath> = fc
	.webUrl({ withFragments: true, withQueryParameters: true })
	.map(flow(unsafeParseURL, fromURL))

// Prefer not to export this.
const phonyBase = "https://urlpath.fp-ts-std.samhh.com"

const exampleOrigin = new URL("https://samhh.com")

const examplePath = "/f/g.h?i=j&k=l&i=m#n"

describe("URLPath", () => {
	describe("isURLPath", () => {
		const f = isURLPath

		it("succeeds only for URLs with phony base", () => {
			expect(f("foo")).toBe(false)
			expect(f(exampleOrigin)).toBe(false)
			expect(f(new URL(phonyBase))).toBe(true)
			expect(f(new URL(phonyBase + examplePath))).toBe(true)
		})
	})

	describe("clone", () => {
		const f = clone

		it("clones to an identical URLPath", () => {
			const x = fromPathname(examplePath)

			expect(f(x)).toEqual(x)
			expect(toString(f(x))).toBe(toString(x))
		})

		it("clones without references", () => {
			const x = fromPathname(examplePath)
			;(x as unknown as URL).pathname = "/foo"
			;(x as unknown as URL).search = "?foo=food&bar=bard&foo=fool"
			const y = f(x)

			expect(getPathname(x)).toBe("/foo")
			expect(getPathname(y)).toBe("/foo")
			expect(getParams(x).getAll("foo")).toEqual(["food", "fool"])
			expect(getParams(y).getAll("foo")).toEqual(["food", "fool"])
			;(x as unknown as URL).pathname = "/bar"
			;(x as unknown as URL).searchParams.set("foo", "bar2000")

			expect(getPathname(x)).toBe("/bar")
			expect(getPathname(y)).toBe("/foo")
			expect(getParams(x).getAll("foo")).toEqual(["bar2000"])
			expect(getParams(y).getAll("foo")).toEqual(["food", "fool"])
		})
	})

	describe("fromURL", () => {
		const f = fromURL

		it("retains the path, params, and hash", () => {
			const x = new URL(exampleOrigin.origin + examplePath)
			const y = pipe(x, f, unpack)

			expect(y.pathname).toEqual(x.pathname)
			expect(y.search).toEqual(x.search)
			expect(y.hash).toEqual(x.hash)
		})

		it("does not retain the origin", () => {
			const x = f(new URL("https://samhh.com/foo")) as unknown as URL
			expect(x.href).toBe(`${phonyBase}/foo`)
		})
	})

	describe("toURL", () => {
		const f = toURL

		it("retains only origin from URL", () => {
			const x = new URL(`https://samhh.com${examplePath}`)
			const y = fromPathname("/foo")

			expect(f(x)(y)).toEqual(new URL("https://samhh.com/foo"))
		})

		it("retains all URLPath parts", () => {
			const x = new URL("https://samhh.com")
			const y = fromString(examplePath)

			expect(f(x)(y)).toEqual(new URL(`https://samhh.com${examplePath}`))
		})

		it("is infallible", () => {
			fc.assert(
				fc.property(
					fc.webUrl().map(unsafeParseURL),
					fc.webPath().map(fromString),
					(origin, path) => {
						f(origin)(path)
					},
				),
			)
		})
	})

	describe("fromString", () => {
		const f = fromString
		const g = flow(f, u => (u as unknown as URL).href)

		it("parses all parts", () => {
			const [x, y, z] = Fn.fork([getPathname, getParams, getHash])(
				f("/foo?bar=yes#baz"),
			)

			expect(x).toBe("/foo")
			expect(y).toEqual(new URLSearchParams({ bar: "yes" }))
			expect(z).toBe("#baz")
		})

		it("parses typical paths", () => {
			expect(g("/")).toBe(`${phonyBase}/`)
			expect(g("/foo.bar")).toBe(`${phonyBase}/foo.bar`)
			expect(g(examplePath)).toBe(`${phonyBase}${examplePath}`)
		})

		it("parses atypical paths", () => {
			expect(g("")).toBe(`${phonyBase}/`)
			expect(g("//")).toBe(`${phonyBase}//`)
			expect(g("//x")).toBe(`${phonyBase}//x`)
			expect(g("///")).toBe(`${phonyBase}///`)
			expect(g(":123")).toBe(`${phonyBase}/:123`)
			expect(g(".net")).toBe(`${phonyBase}/.net`)
			expect(g("a:")).toBe(`${phonyBase}/a:`)
			expect(g("https://samhh.com/foo/bar")).toBe(
				`${phonyBase}/https://samhh.com/foo/bar`,
			)
			expect(g("//samhh.com/foo/bar")).toBe(`${phonyBase}//samhh.com/foo/bar`)
			expect(g("/.")).toBe(`${phonyBase}/`)
			expect(g("/.a/.")).toBe(`${phonyBase}/.a/`)
		})

		// These are documented edge cases that either behave differently in
		// different environments or straight up don't work.
		it.skip("edge cases", () => {
			// Why oh why would someone be using this URL? 🤔
			expect(g("//urlpath.fp-ts-std.samhh.com/foo")).toBe("/foo")

			// Produce different results across different engines e.g. Node.js and
			// Bun. Looks related to:
			//   https://datatracker.ietf.org/doc/html/rfc3986#section-6.2.2.3
			expect(g("//.a/.")).toBe(`${phonyBase}//.a/.`)
			expect(g("//.a/..")).toBe(`${phonyBase}//.a/..`)
		})

		it("is infallible", () => {
			fc.assert(
				fc.property(fc.oneof(fc.string(), fc.webPath()), x => {
					f(x)
				}),
			)
		})

		it("always keeps phony base", () => {
			fc.assert(
				fc.property(fc.oneof(fc.string(), fc.webPath()), x =>
					expect((f(x) as unknown as URL).origin).toBe(phonyBase),
				),
				{ numRuns: 10000 },
			)
		})
	})

	describe("toString", () => {
		const f = toString

		it("returns all concatenated parts", () => {
			const x = "/a/b.c?d=e&f=g&d=h#i"
			const y: URLPath = fromURL(new URL(exampleOrigin.origin + x))

			expect(f(y)).toBe(x)
		})
	})

	describe("fromPathname", () => {
		const f = fromPathname

		// Putting aside the prefixed `/`, the pathname setter doesn't seem to
		// encode to the rules of either `encodeURI` or `encodeURIComponent`.
		it("sets encoded path", () => {
			const u = pipe("foo bar?", f, toURL(exampleOrigin))

			expect(u.pathname).toBe("/foo%20bar%3F")
		})

		it("trims relative paths beyond root", () => {
			const g = flow(f, toURL(exampleOrigin), x => x.pathname)

			expect(g("/foo/bar/../baz")).toBe("/foo/baz")
			expect(g("/foo/bar/../../baz")).toBe("/baz")
			expect(g("/foo/bar/../../../baz")).toBe("/baz")
			expect(g("/../baz")).toBe("/baz")
			expect(g("./baz")).toBe("/baz")
		})

		it("never throws", () => {
			fc.assert(
				fc.property(fc.string(), x => {
					f(x)
				}),
			)
		})

		it("flip setPathname . fromPathname = setPathname y (fromPathname x) = fromPathname y", () => {
			fc.assert(
				fc.property(fc.string(), fc.string(), (x, y) => {
					const a = setPathname(y)(fromPathname(x))
					const b = fromPathname(y)

					expect(a).toEqual(b)
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

		it("setPathname =<< getPathname = setPathname (getPathname x) x = id", () => {
			fc.assert(
				fc.property(fc.string().map(fromPathname), x =>
					expect(pipe(getPathname, Fn.chain(setPathname), apply(x))).toEqual(x),
				),
			)
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
			const y = f(s => `${s}bar`)(x)

			expect(getPathname(x)).toBe("/foo")
			expect(getPathname(y)).toBe("/foobar")
		})
	})

	describe("getParams", () => {
		const f = getParams

		it("returns the search params", () => {
			const s = "?a=b&c=d&a=e"
			const r = fromURL(new URL(exampleOrigin.origin + s))
			const p = new URLSearchParams(s)

			expect(f(r)).toEqual(p)
		})
	})

	describe("setParams", () => {
		const f = setParams

		it("sets the search params without mutating input", () => {
			const s = "?a=b"
			const p = new URLSearchParams(s)
			const u = new URL(exampleOrigin.origin + s)

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
			const u = new URL(exampleOrigin.origin + s)

			const pp = new URLSearchParams("?a=e&c=d")
			const r = pipe(u, fromURL, f(Params.upsertAt("a")("e")))

			expect(u.searchParams).toEqual(p)
			expect(getParams(r)).toEqual(pp)
		})
	})

	describe("getHash", () => {
		const f = getHash

		it("returns the hash", () => {
			const h = "#foo"
			const r = fromURL(new URL(exampleOrigin.origin + h))

			expect(f(r)).toBe(h)
		})
	})

	describe("setHash", () => {
		const f = setHash

		it("sets the hash without mutating input", () => {
			const h = "#foo"
			const x = fromURL(new URL(exampleOrigin.origin + h))
			const y = f("bar")(x)

			expect(getHash(x)).toBe("#foo")
			expect(getHash(y)).toBe("#bar")
		})
	})

	describe("modifyHash", () => {
		const f = modifyHash

		it("modifies the hash with the provided function without mutating input", () => {
			const h = "#foo"
			const x = fromURL(new URL(exampleOrigin.origin + h))
			const y = f(s => `${s}bar`)(x)

			expect(getHash(x)).toBe("#foo")
			expect(getHash(y)).toBe("#foobar")
		})
	})

	describe("Eq", () => {
		const f = Eq.equals
		const g = fromString

		it("works", () => {
			const x = "/foo.bar#baz"

			expect(f(g(x), g(x))).toBe(true)
			expect(f(g(x), g(`${x}!`))).toBe(false)
		})

		it("is lawful", () => {
			laws.eq(Eq, arb)
		})
	})
})
