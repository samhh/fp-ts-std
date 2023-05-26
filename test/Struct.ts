import {
  get,
  pick,
  pickFrom,
  omit,
  omitFrom,
  merge,
  withDefaults,
  renameKey,
} from "../src/Struct"
import { pipe } from "fp-ts/function"

describe("Struct", () => {
  describe("get", () => {
    const f = get

    it("returns the associated value", () => {
      expect(pipe({ a: 1, b: "foo" }, f("a"))).toBe(1)
    })
  })

  describe("pick", () => {
    const f = pick

    type Thing = { name: string; age: number; email?: string }
    const x: Thing = { name: "Hodor", age: 123 }
    const y: Thing = { name: "Hodor", age: 123, email: "foo@bar.com" }

    it("picks no keys", () => {
      expect(pipe(x, f([]))).toEqual({})
    })

    it("picks individual keys", () => {
      expect(pipe(x, f(["name"]))).toEqual({ name: "Hodor" })
      expect(pipe(x, f(["age"]))).toEqual({ age: 123 })
      expect(pipe(x, f(["email"]))).toStrictEqual({})
      expect(pipe(y, f(["email"]))).toStrictEqual({ email: "foo@bar.com" })
    })

    it("picks multiple keys", () => {
      expect(pipe(x, f(["name", "age", "email"]))).toStrictEqual(x)
      expect(pipe(y, f(["name", "age", "email"]))).toStrictEqual(y)
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
    const f = omit

    type Thing = { name: string; id: string; foo: string }

    it("omits multiple keys", () => {
      const before: Thing = { name: "Ragnor", id: "789", foo: "Bar" }
      const after: Omit<Thing, "id" | "foo"> = { name: "Ragnor" }

      expect(f(["id", "foo"])(before)).toEqual(after)
    })
  })

  describe("omitFrom", () => {
    type Thing = { name: string; id: string; foo: string }
    const f = omitFrom<Thing>()

    it("omits multiple keys", () => {
      const before: Thing = { name: "Ragnor", id: "789", foo: "Bar" }
      const after: Omit<Thing, "id" | "foo"> = { name: "Ragnor" }

      expect(f(["id", "foo"])(before)).toEqual(after)
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

  describe("withDefaults", () => {
    const f = withDefaults

    it("provides defaults for optional values, requiring values if and only if a property is optional", () => {
      const x: { a: number; b?: string } = { a: 1 }
      const y = pipe(x, f({ b: "foo" }))

      /* eslint-disable functional/no-expression-statements */
      // @ts-expect-error -- missing an optional property of x
      pipe(x, f({}))
      // @ts-expect-error -- includes required properties
      pipe(x, f({ a: 2, b: "" }))
      // @ts-expect-error -- includes excess properties
      pipe(x, f({ b: "", c: "foo" }))
      /* eslint-enable functional/no-expression-statements */

      expect(y).toEqual({ a: 1, b: "foo" })
    })

    it("preserves preexisting optional properties", () => {
      const x: { a: number; b?: string } = { a: 1, b: "foo" }
      const y = pipe(x, f({ b: "bar" }))

      expect(y).toEqual(x)
    })
  })

  describe("renameKey", () => {
    const f = renameKey

    it("adds non-preexisting key", () => {
      expect(pipe({ a: "foo", b: "bar" }, f("a")("c"))).toEqual({
        b: "bar",
        c: "foo",
      })
    })

    it("overwrites preexisting key", () => {
      expect(pipe({ a: "foo", b: "bar" }, f("a")("b"))).toEqual({
        b: "foo",
      })
    })

    it("does not insert non-preexisting optional properties", () => {
      const x = pipe({ a: "foo" } as { a: string; b?: string }, f("b")("c"))

      expect(x).toEqual({
        a: "foo",
      })
      expect(Object.keys(x)).toEqual(["a"])
    })
  })
})
