import { describe, it, expect } from "@jest/globals"
import {
  empty,
  fromString,
  toString,
  toLeadingString,
  fromRecord,
  toRecord,
  fromTuples,
  toTuples,
  clone,
  isURLSearchParams,
  isEmpty,
  lookupFirst,
  lookup,
  upsertAt,
  singleton,
  Eq,
  Semigroup,
  Monoid,
  appendAt,
  deleteAt,
  keys,
  values,
  size,
  concatBy,
  fromMap,
  toMap,
} from "../src/URLSearchParams"
import fc from "fast-check"
import * as R from "fp-ts/Record"
import * as M from "fp-ts/Map"
import * as O from "fp-ts/Option"
import * as A from "fp-ts/Array"
import * as T from "fp-ts/Tuple"
import * as Str from "fp-ts/string"
import { constant, flip, pipe } from "fp-ts/function"
import * as laws from "fp-ts-laws"
import { not } from "fp-ts/Predicate"
import { withFst, withSnd } from "../src/Tuple"
import { uncurry2 } from "../src/Function"

const arb: fc.Arbitrary<URLSearchParams> = fc
  .webQueryParameters()
  .map(fromString)

describe("URLSearchParams", () => {
  describe("empty", () => {
    it("has no keys", () => {
      expect(empty.toString()).toBe("")
    })
  })

  describe("fromString", () => {
    const f = fromString

    it("parses roughly as expected", () => {
      expect(f("a").get("a")).toEqual("")
      expect(f("a,b").get("a,b")).toEqual("")
      expect(f("a=b").get("a")).toEqual("b")
      expect(f("?a=b").get("a")).toEqual("b")
      expect(f("x=y&a=b").get("a")).toEqual("b")
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

  describe("toString", () => {
    const f = toString

    it("returns query string without a question mark", () => {
      const s = "a=b&c=d&a=e"
      const u = new URLSearchParams(s)

      expect(f(u)).toBe(s)
    })
  })

  describe("toLeadingString", () => {
    const f = toLeadingString

    it("returns an empty string for empty params", () => {
      expect(f(new URLSearchParams())).toBe("")
    })

    it("returns a prefixed string for non-empty params", () => {
      expect(f(new URLSearchParams("a=b"))).toBe("?a=b")

      fc.assert(
        fc.property(arb.filter(not(isEmpty)), xs => expect(f(xs)[0]).toBe("?")),
      )
    })
  })

  describe("fromRecord", () => {
    const f = fromRecord

    it("parses roughly as expected", () => {
      expect(f({ a: ["b"] }).get("a")).toBe("b")
      expect(f({ "a,b": ["c"] }).get("a,b")).toBe("c")
      expect(f({ x: ["y"], a: ["b"] }).get("a")).toBe("b")

      const x = f({ x: [], y: ["y1"], z: ["z1", "z2"] })
      expect(x.getAll("x")).toEqual([])
      expect(x.getAll("y")).toEqual(["y1"])
      expect(x.getAll("z")).toEqual(["z1", "z2"])
    })

    it("migrates every key", () => {
      fc.assert(
        fc.property(
          fc.dictionary(fc.string(), fc.array(fc.string(), { minLength: 1 })),
          x => {
            const y = f(x)
            return R.keys(x).every(z => y.has(z))
          },
        ),
      )
    })

    it("never throws", () => {
      fc.assert(
        fc.property(fc.dictionary(fc.string(), fc.array(fc.string())), x => {
          // eslint-disable-next-line functional/no-expression-statements
          f(x)
        }),
      )
    })
  })

  describe("toRecord", () => {
    const f = toRecord

    it("returns all values grouped by key", () => {
      const x = new URLSearchParams("a=b&c=d&a=e")

      expect(f(x)).toEqual({ a: ["b", "e"], c: ["d"] })
    })
  })

  describe("fromTuples", () => {
    const f = fromTuples

    it("parses roughly as expected", () => {
      expect(f([["a", "b"]]).get("a")).toEqual("b")
      expect(f([["a,b", "c"]]).get("a,b")).toEqual("c")
      expect(
        f([
          ["x", "y"],
          ["a", "b"],
        ]).get("a"),
      ).toEqual("b")
    })

    it("migrates every key", () => {
      fc.assert(
        fc.property(fc.array(fc.tuple(fc.string(), fc.string())), xs => {
          const y = f(xs)
          return xs.map(T.fst).every(z => y.has(z))
        }),
      )
    })

    it("never throws", () => {
      fc.assert(
        fc.property(fc.array(fc.tuple(fc.string(), fc.string())), x => {
          // eslint-disable-next-line functional/no-expression-statements
          f(x)
        }),
      )
    })
  })

  describe("toTuples", () => {
    const f = toTuples

    it("returns all key/value pairs", () => {
      const xs: Array<[string, string]> = [
        ["a", "b"],
        ["c", "d"],
        ["a", "e"],
      ]
      const y = new URLSearchParams(xs)

      expect(f(y)).toEqual(xs)
    })
  })

  describe("clone", () => {
    const f = clone

    it("does not mutate input", () => {
      const x = new URLSearchParams()
      const y = f(x)
      y.set("a", "b") // eslint-disable-line functional/no-expression-statements

      expect(y.has("a")).toBe(true)
      expect(x.has("a")).toBe(false)
    })
  })

  describe("isURLSearchParams", () => {
    const f = isURLSearchParams

    it("works", () => {
      expect(f(new URL("https://samhh.com"))).toBe(false)
      expect(f(empty)).toBe(true)
      expect(f(fromRecord({ a: ["b"] }))).toBe(true)
    })
  })

  describe("isEmpty", () => {
    const f = isEmpty

    it("works", () => {
      expect(f(new URLSearchParams())).toBe(true)
      expect(f(new URLSearchParams({ a: "b" }))).toBe(false)
    })
  })

  describe("lookupFirst", () => {
    const f = flip(lookupFirst)(fromString("a=b1&a=b2"))

    it("works", () => {
      expect(f("a")).toEqual(O.some("b1"))
      expect(f("b")).toEqual(O.none)
    })
  })

  describe("lookup", () => {
    const f = flip(lookup)(fromString("a=b1&a=b2"))

    it("works", () => {
      expect(f("a")).toEqual(O.some(["b1", "b2"]))
      expect(f("b")).toEqual(O.none)
    })
  })

  describe("upsertAt", () => {
    const f = upsertAt("x")("y")

    describe("returns updated data", () => {
      it("creates new property", () => {
        expect(f(new URLSearchParams())).toEqual(
          new URLSearchParams({ x: "y" }),
        )
      })

      it("updates preexisting property", () => {
        expect(f(new URLSearchParams({ x: "z" }))).toEqual(
          new URLSearchParams({ x: "y" }),
        )
      })
    })

    it("does not mutate input", () => {
      const x = new URLSearchParams({ x: "z" })
      const y = f(x)

      expect(x.get("x")).toBe("z")
      expect(y.get("x")).toBe("y")
    })
  })

  describe("singleton", () => {
    const f = singleton

    it("is always retrievable", () => {
      fc.assert(
        fc.property(fc.string(), fc.string(), (k, v) =>
          expect(pipe(f(k)(v), lookupFirst(k))).toEqual(O.some(v)),
        ),
      )
    })

    it("never throws", () => {
      fc.assert(
        fc.property(fc.string(), fc.string(), (k, v) => {
          // eslint-disable-next-line functional/no-expression-statements
          f(k)(v)
        }),
      )
    })
  })

  describe("Eq", () => {
    const f = Eq.equals
    const g = fromString

    it("compares", () => {
      expect(f(g("a=1"), g("b=1"))).toBe(false)
      expect(f(g("a=1"), g("a=2"))).toBe(false)
      expect(f(g("a=1"), g("a=1"))).toBe(true)
    })

    it("considers all key values", () => {
      const x = "a=1&b=2&a=3"

      expect(f(g(x), g(x))).toBe(true)
      expect(f(g(x), g(x + "&b=4"))).toBe(false)
    })

    it("disregards order", () => {
      expect(f(g("a=1&b=2"), g("b=2&a=1"))).toBe(true)
    })

    it("is lawful", () => {
      laws.eq(Eq, arb)
    })
  })

  describe("appendAt", () => {
    const f = appendAt

    it("does not overwrite preexisting keys", () => {
      const xs = fromString("a=1&b=2")
      const ys = f("a")("3")(xs)

      expect(lookup("a")(ys)).toEqual(O.some(["1", "3"]))
    })

    it("always increases the size of the dataset", () => {
      fc.assert(
        fc.property(arb, fc.string(), fc.string(), (xs, k, v) =>
          expect(toString(f(k)(v)(xs)).length).toBeGreaterThan(
            toString(xs).length,
          ),
        ),
      )
    })
  })

  describe("deleteAt", () => {
    const f = deleteAt

    it("deletes all values with the associated key", () => {
      const xs = fromString("a=1&b=2&a=3")
      const ys = f("a")(xs)

      expect(lookup("a")(xs)).toEqual(O.some(["1", "3"]))
      expect(lookup("a")(ys)).toEqual(O.none)
    })

    it("never increases the size of the dataset", () => {
      fc.assert(
        fc.property(arb, fc.string(), (xs, k) =>
          expect(toString(f(k)(xs)).length).toBeLessThanOrEqual(
            toString(xs).length,
          ),
        ),
      )
    })
  })

  describe("keys", () => {
    const f = keys

    it("returns all keys", () => {
      expect(f(new URLSearchParams())).toEqual([])
      expect(f(new URLSearchParams("a=1&b=2&a=3"))).toEqual(["a", "b", "a"])

      fc.assert(
        fc.property(fc.array(fc.string()), ks => {
          const xs = pipe(ks, A.map(withSnd("foo")))

          expect(f(new URLSearchParams(xs))).toEqual(ks)
        }),
      )
    })
  })

  describe("values", () => {
    const f = values

    it("returns all values", () => {
      expect(f(new URLSearchParams())).toEqual([])
      expect(f(new URLSearchParams("a=1&b=2&a=3"))).toEqual(["1", "2", "3"])

      fc.assert(
        fc.property(fc.array(fc.string()), vs => {
          const xs = pipe(vs, A.map(withFst("foo")))

          expect(f(new URLSearchParams(xs))).toEqual(vs)
        }),
      )
    })
  })

  describe("size", () => {
    const f = size

    it("is equivalent to the size of the total number of potentially duplicative keys", () => {
      expect(f(new URLSearchParams())).toBe(0)
      expect(f(new URLSearchParams("a=1&b=2&a=3"))).toBe(3)

      fc.assert(
        fc.property(fc.array(fc.string()), ks => {
          const xs = pipe(ks, A.map(withSnd("foo")))
          const ys = new URLSearchParams(xs)

          expect(f(ys)).toEqual(A.size(ks))
          expect(f(ys)).toEqual(A.size(keys(ys)))
        }),
      )
    })
  })

  describe("concatBy", () => {
    const f = concatBy

    it("concats as per the provided function", () => {
      const x = fromTuples([
        ["foo", "a"],
        ["bar", "b"],
      ])

      const y = fromTuples([
        ["baz", "c"],
        ["foo", "d"],
        ["foo", "e"],
      ])

      const first = constant(T.fst)
      const last = constant(T.snd)
      const both = constant(uncurry2(A.concat))
      const neither = constant(constant([]))

      expect(f(first)(x)(y).toString()).toBe("foo=a&bar=b&baz=c")
      expect(f(last)(x)(y).toString()).toBe("foo=d&foo=e&bar=b&baz=c")
      expect(f(both)(x)(y).toString()).toBe("foo=d&foo=e&foo=a&bar=b&baz=c")
      expect(f(neither)(x)(y).toString()).toBe("bar=b&baz=c")
    })

    it("does not mutate input", () => {
      const x = fromTuples([
        ["foo", "a"],
        ["bar", "b"],
      ])

      const y = fromTuples([
        ["baz", "c"],
        ["foo", "d"],
      ])

      const xa = x.toString()
      const ya = y.toString()

      // eslint-disable-next-line functional/no-expression-statements
      concatBy(constant(uncurry2(A.concat)))(x)(y)

      const xb = x.toString()
      const yb = y.toString()

      expect(xa).toBe(xb)
      expect(ya).toBe(yb)
    })
  })

  describe("Semigroup", () => {
    const f = Semigroup.concat

    it("keeps all key/value pairs", () => {
      const xs = fromString("a=1&b=2&a=3")
      const ys = fromString("b=4&c=5")

      expect(f(xs, ys)).toEqual(fromString("a=1&a=3&b=4&b=2&c=5"))
      expect(f(ys, xs)).toEqual(fromString("b=2&b=4&c=5&a=1&a=3"))
    })

    it("is lawful", () => {
      laws.semigroup(Semigroup, Eq, arb)
    })
  })

  describe("Monoid", () => {
    it("it lawful", () => {
      laws.monoid(Monoid, Eq, arb)
    })
  })

  describe("fromMap", () => {
    const f = fromMap

    const mapArb: fc.Arbitrary<Map<string, Array<string>>> = fc
      .array(fc.tuple(fc.string(), fc.array(fc.string())))
      .map(M.fromFoldable(Str.Eq, A.getSemigroup<string>(), A.Foldable))

    it("is infallible", () => {
      fc.assert(fc.property(mapArb, xs => isURLSearchParams(f(xs))))
    })

    it("takes all key/value pairs", () => {
      const xs: Array<[string, Array<string>]> = [
        ["a", ["1", "2"]],
        ["b", ["3"]],
      ]

      expect(f(new Map(xs))).toEqual(fromString("a=1&a=2&b=3"))
    })
  })

  describe("toMap", () => {
    const f = toMap

    it("is infallible", () => {
      fc.assert(fc.property(arb, xs => f(xs) instanceof Map))
    })

    it("takes all key/value pairs", () => {
      const xs: Array<[string, Array<string>]> = [
        ["a", ["1", "3"]],
        ["b", ["2"]],
      ]

      expect(f(fromString("a=1&b=2&a=3"))).toEqual(new Map(xs))
    })
  })
})
