import { describe, it, expect } from "@jest/globals"
import {
  empty,
  fromString,
  toString,
  fromRecord,
  toRecord,
  fromTuples,
  toTuples,
  clone,
  isURLSearchParams,
  isEmpty,
  getParam,
  getAllForParam,
  setParam,
} from "../src/URLSearchParams"
import fc from "fast-check"
import { keys } from "fp-ts/Record"
import * as O from "fp-ts/Option"
import * as T from "fp-ts/Tuple"
import { flip } from "fp-ts/function"

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
            return keys(x).every(z => y.has(z))
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

  describe("getParam", () => {
    const f = flip(getParam)(fromString("a=b1&a=b2"))

    it("works", () => {
      expect(f("a")).toEqual(O.some("b1"))
      expect(f("b")).toEqual(O.none)
    })
  })

  describe("getAllForParam", () => {
    const f = flip(getAllForParam)(fromString("a=b1&a=b2"))

    it("works", () => {
      expect(f("a")).toEqual(O.some(["b1", "b2"]))
      expect(f("b")).toEqual(O.none)
    })
  })

  describe("setParam", () => {
    const f = setParam("x")("y")

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
})
