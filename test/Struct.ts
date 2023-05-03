import {
  pick,
  pickFrom,
  omit,
  omitFrom,
  merge,
  withDefaults,
  renameKey,
  getEq,
  getOrd,
  getBounded,
  getEnum,
} from "../src/Struct"
import { pipe } from "fp-ts/function"
import { Enum as EnumBool, Bounded as BoundedBool } from "../src/Boolean"
import { universe } from "../src/Enum"
import * as A from "fp-ts/Array"
import * as O from "fp-ts/Option"
import Option = O.Option
import * as Bool from "fp-ts/boolean"
import * as Str from "fp-ts/string"
import * as Num from "fp-ts/number"
import { LT, EQ, GT } from "../src/Ordering"

describe("Struct", () => {
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

  describe("getEq", () => {
    const f = getEq

    it("checks across all properties", () => {
      type T = { foo: boolean; bar: number; baz: Option<string> }
      const { equals: g } = f<T>({
        foo: Bool.Eq,
        bar: Num.Eq,
        baz: O.getEq(Str.Eq),
      })

      expect(
        g(
          { foo: true, bar: 123, baz: O.some("ciao") },
          { foo: true, bar: 123, baz: O.some("ciao") },
        ),
      ).toBe(true)

      expect(
        g(
          { foo: true, bar: 123, baz: O.some("ciao") },
          { foo: false, bar: 123, baz: O.some("ciao") },
        ),
      ).toBe(false)

      expect(
        g(
          { foo: true, bar: 123, baz: O.some("ciao") },
          { foo: true, bar: 124, baz: O.some("ciao") },
        ),
      ).toBe(false)

      expect(
        g(
          { foo: true, bar: 123, baz: O.some("ciao") },
          { foo: true, bar: 123, baz: O.some("bonjour") },
        ),
      ).toBe(false)

      expect(
        g(
          { foo: true, bar: 123, baz: O.some("ciao") },
          { foo: true, bar: 123, baz: O.none },
        ),
      ).toBe(false)
    })
  })

  describe("getOrd", () => {
    const f = getOrd

    it("compares across all properties", () => {
      type T = { foo: boolean; bar: number; baz: boolean }
      const { compare: g } = f<T>({
        foo: Bool.Ord,
        bar: Num.Ord,
        baz: Bool.Ord,
      })

      const x: T = { foo: true, bar: 123, baz: true }

      expect(g(x, x)).toBe(EQ)
      expect(g(x, { ...x, bar: 124 })).toBe(LT)
      expect(g(x, { ...x, foo: false })).toBe(GT)
      expect(g(x, { ...x, baz: false })).toBe(GT)
      expect(g(x, { ...x, foo: false, baz: true })).toBe(GT)
    })
  })

  describe("getBounded", () => {
    const f = getBounded
    type T = { foo: boolean; bar: 0 | 1 | 2 }
    const B = f<T>({ foo: BoundedBool, bar: { ...Num.Ord, top: 2, bottom: 0 } })

    it("top is combined top of each property", () => {
      expect(B.top).toEqual({ foo: true, bar: 2 })
    })

    it("bottom is combined bottom of each property", () => {
      expect(B.bottom).toEqual({ foo: false, bar: 0 })
    })
  })

  describe.only("getEnum", () => {
    const f = getEnum

    describe.only('toEnum', () => {
      it('TODO pls', () => {
        type T = { foo: boolean; bar: boolean; baz: boolean }
        const E = f<T>({ foo: EnumBool, bar: EnumBool, baz: EnumBool })

        expect(E.toEnum(-1)).toEqual(O.none)
        expect(E.toEnum(0)).toEqual(O.some({ foo: false, bar: false, baz: false }))
        expect(E.toEnum(1)).toEqual(O.some({ foo: true, bar: false, baz: false }))
        expect(E.toEnum(7)).toEqual(O.some({ foo: true, bar: true, baz: true }))
        expect(E.toEnum(8)).toEqual(O.none)
      })
    })

    describe("fromEnum", () => {
      it("calculates for product of equal cardinalities", () => {
        type T = { foo: boolean; bar: boolean; baz: boolean }
        const E = f<T>({ foo: EnumBool, bar: EnumBool, baz: EnumBool })

        // TODO broken universe. key order looks good in the first log I think
        // console.log(
        //   E.bottom,
        //   E.succ(E.bottom),
        //   pipe(E.bottom, E.succ, O.chain(E.succ)),
        // )
        console.log("broken universe: ", universe(E))
        // const pls = pipe(universe(E), A.map(E.fromEnum))

        // TODO add many more. remember order is alphabetical on keys
        expect(E.fromEnum({ foo: true, bar: true, baz: false })).toBe(5)
      })
    })
  })
})
