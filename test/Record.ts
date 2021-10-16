import {
  values,
  lookupFlipped,
  pick,
  pickFrom,
  omit,
  reject,
  merge,
  invertLast,
  invertAll,
} from "../src/Record"
import * as O from "fp-ts/Option"
import * as R from "fp-ts/Record"
import * as A from "fp-ts/Array"
import fc from "fast-check"
import { flow, pipe } from "fp-ts/function"
import { Predicate } from "fp-ts/Predicate"
import { fromNumber } from "../src/String"
import * as N from "fp-ts/number"
import * as S from "fp-ts/string"

describe("Record", () => {
  describe("values", () => {
    const f = values

    it("gets object values", () => {
      expect(f({})).toEqual([])
      expect(f({ a: 1 })).toEqual([1])
      expect(f({ a: 1, b: ["two"] })).toEqual([1, ["two"]])
    })
  })

  describe("lookupFlipped", () => {
    const f = lookupFlipped

    it("cannot find anything in empty object", () => {
      fc.assert(fc.property(fc.string(), x => O.isNone(f({})(x))))
    })

    it("finds matching key", () => {
      expect(f({ a: 1 })("a")).toEqual(O.some(1))
      expect(f({ a: ["two"], b: "a" })("a")).toEqual(O.some(["two"]))
    })
  })

  describe("pick", () => {
    type Thing = { name: string; age: number }
    const x: Thing = { name: "Hodor", age: 123 }

    it("picks no keys", () => {
      expect(pipe(x, pick([]))).toEqual({})
    })

    it("picks individual keys", () => {
      expect(pipe(x, pick(["name"]))).toEqual({ name: "Hodor" })
      expect(pipe(x, pick(["age"]))).toEqual({ age: 123 })
    })

    it("picks multiple keys", () => {
      expect(pipe(x, pick(["name", "age"]))).toEqual(x)
    })
  })

  describe("pickFrom", () => {
    type Thing = { name: string; age: number }
    const x: Thing = { name: "Hodor", age: 123 }
    const f = pickFrom<Thing>()

    it("picks no keys", () => {
      expect(f([])(x)).toEqual({})
    })

    it("picks individual keys", () => {
      expect(f(["name"])(x)).toEqual({ name: "Hodor" })
      expect(f(["age"])(x)).toEqual({ age: 123 })
    })

    it("picks multiple keys", () => {
      expect(f(["name", "age"])(x)).toEqual(x)
    })
  })

  describe("omit", () => {
    type Thing = { name: string; id: string; foo: string }

    it("omits multiple keys", () => {
      const before: Thing = { name: "Ragnor", id: "789", foo: "Bar" }
      const after: Omit<Thing, "id" | "foo"> = { name: "Ragnor" }

      expect(omit(["id", "foo"])(before)).toEqual(after)
    })

    it("typechecks missing keys", () => {
      const before: Thing = { name: "Ragnor", id: "789", foo: "Bar" }
      const after: Omit<Thing, "id"> = { name: "Ragnor", foo: "Bar" }

      expect(omit(["id", "bar"])(before)).toEqual(after)
    })
  })

  describe("reject", () => {
    const p: Predicate<number> = n => n % 2 === 0
    const f = reject(p)

    it("filters out items for which the predicate holds", () => {
      expect(f({ a: 1, b: 2, c: 3, d: 4 })).toEqual({ a: 1, c: 3 })
    })

    it("is the inverse of filter", () => {
      fc.assert(
        fc.property(
          fc.dictionary(fc.string(), fc.integer()),
          xs =>
            pipe(xs, R.filter(p), R.size) + pipe(xs, f, R.size) === R.size(xs),
        ),
      )
    })
  })

  describe("merge", () => {
    const f = merge

    it("merges, prioritising the second input", () => {
      expect(f({ a: 1, b: 2 })({ b: "two", c: true })).toEqual({
        a: 1,
        b: "two",
        c: true,
      })
    })
  })

  describe("invertLast", () => {
    const f = invertLast

    it("inverts", () => {
      expect(f(fromNumber)({ a: 1, b: 2, c: 3 })).toEqual({
        "1": "a",
        "2": "b",
        "3": "c",
      })
    })

    it("keeps the last value for duplicate key", () => {
      expect(f(fromNumber)({ a: 1, b: 2, c: 2, d: 3 })).toEqual({
        "1": "a",
        "2": "c",
        "3": "d",
      })
    })

    it("has every unique transformed value as a key", () => {
      const g = fromNumber
      const h: (x: Record<string, number>) => Array<string> = flow(
        values,
        A.uniq(N.Eq),
        A.map(g),
      )

      fc.assert(
        fc.property(fc.dictionary(fc.string(), fc.integer()), x =>
          pipe(x, f(g), R.keys, ks =>
            pipe(
              h(x),
              A.every(k => A.elem(S.Eq)(k)(ks)),
            ),
          ),
        ),
      )
    })
  })

  describe("invertAll", () => {
    const f = invertAll

    it("inverts", () => {
      expect(f(fromNumber)({ a: 1, b: 2, c: 3 })).toEqual({
        "1": ["a"],
        "2": ["b"],
        "3": ["c"],
      })
    })

    it("keeps the all values for duplicate key", () => {
      expect(f(fromNumber)({ a: 1, b: 2, c: 2, d: 3 })).toEqual({
        "1": ["a"],
        "2": ["b", "c"],
        "3": ["d"],
      })
    })

    it("has every unique transformed value as a key", () => {
      const g = fromNumber
      const h: (x: Record<string, number>) => Array<string> = flow(
        values,
        A.uniq(N.Eq),
        A.map(g),
      )

      fc.assert(
        fc.property(fc.dictionary(fc.string(), fc.integer()), x =>
          pipe(x, f(g), R.keys, ks =>
            pipe(
              h(x),
              A.every(k => A.elem(S.Eq)(k)(ks)),
            ),
          ),
        ),
      )
    })
  })
})
