import { describe, expect, it } from "@jest/globals"
import fc from "fast-check"
import * as laws from "fp-ts-laws"
import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import { constant, pipe } from "fp-ts/function"
import {
	Eq,
	clone,
	getHash,
	getHostname,
	getOrigin,
	getParams,
	getPathname,
	isStringlyURL,
	isURL,
	modifyHash,
	modifyParams,
	modifyPathname,
	parse,
	parseO,
	setHash,
	setParams,
	setPathname,
	toString,
	unsafeParse,
} from "../src/URL"
import * as Params from "../src/URLSearchParams"

const arb: fc.Arbitrary<URL> = fc
	.webUrl({ withFragments: true, withQueryParameters: true })
	.map(unsafeParse)

const validBase = "https://a:b@c.d.e:1"
const validUrl = `${validBase}/f/g.h?i=j&k=l&i=m#n`

const fromPathname = (x: string): URL => {
	const y = new URL(validBase)
	y.pathname = x
	return y
}

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
			x.pathname = "/foo"
			x.search = "?foo=food&bar=bard&foo=fool"
			const y = f(x)

			expect(x.pathname).toBe("/foo")
			expect(y.pathname).toBe("/foo")
			expect(x.searchParams.getAll("foo")).toEqual(["food", "fool"])
			expect(y.searchParams.getAll("foo")).toEqual(["food", "fool"])

			x.pathname = "/bar"
			x.searchParams.set("foo", "bar2000")

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

	describe("isStringlyURL", () => {
		const f = isStringlyURL

		it("works", () => {
			expect(f("invalid")).toBe(false)
			expect(f(validUrl)).toBe(true)

			fc.assert(fc.property(fc.webUrl(), f))
		})
	})

	describe("toString", () => {
		const f = toString

		it("is the same as prototypal toString and href", () => {
			const u = new URL(validUrl)
			const x = f(u)

			expect(x).toBe(u.toString())
			expect(x).toBe(u.href)
		})

		it("is lossless (excluding formatting)", () => {
			fc.assert(
				fc.property(
					fc.webUrl({ withFragments: true, withQueryParameters: true }),
					x =>
						// biome-ignore lint/suspicious/noSelfCompare: Incorrect lint.
						pipe(x, unsafeParse, f, unsafeParse, f) === pipe(x, unsafeParse, f),
				),
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
			const y = f(s => `${s}bar`)(x)

			expect(getPathname(x)).toBe("/foo")
			expect(getPathname(y)).toBe("/foobar")
		})
	})

	describe("getParams", () => {
		const f = getParams

		it("returns the search params", () => {
			const s = "?a=b&c=d&a=e"
			const r = new URL(validBase + s)
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
			const r = f(pp)(u)

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
			const r = pipe(u, f(Params.upsertAt("a")("e")))

			expect(u.searchParams).toEqual(p)
			expect(getParams(r)).toEqual(pp)
		})
	})

	describe("getHash", () => {
		const f = getHash

		it("returns the hash", () => {
			const h = "#foo"
			const r = new URL(validBase + h)

			expect(f(r)).toBe(h)
		})
	})

	describe("setHash", () => {
		const f = setHash

		it("sets the hash without mutating input", () => {
			const h = "#foo"
			const x = new URL(validBase + h)
			const y = f("bar")(x)

			expect(getHash(x)).toBe("#foo")
			expect(getHash(y)).toBe("#bar")
		})
	})

	describe("modifyHash", () => {
		const f = modifyHash

		it("modifies the hash with the provided function without mutating input", () => {
			const h = "#foo"
			const x = new URL(validBase + h)
			const y = f(s => `${s}bar`)(x)

			expect(getHash(x)).toBe("#foo")
			expect(getHash(y)).toBe("#foobar")
		})
	})

	describe("getOrigin", () => {
		const f = getOrigin

		it("works", () => {
			expect(f(new URL("https://u:p@a.b.e:123/foo"))).toBe("https://a.b.e:123")
		})
	})

	describe("getHostname", () => {
		const f = getHostname

		it("works", () => {
			expect(f(new URL("https://u:p@a.b.e:123/foo"))).toBe("a.b.e")
		})
	})

	describe("Eq", () => {
		const f = Eq.equals
		const g = unsafeParse

		it("works", () => {
			const x = "https://samhh.com/foo.bar#baz"

			expect(f(g(x), g(x))).toBe(true)
			expect(f(g(x), g(`${x}!`))).toBe(false)
		})

		it("is lawful", () => {
			laws.eq(Eq, arb)
		})
	})
})
