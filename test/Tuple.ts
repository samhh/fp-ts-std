import {
  dup,
  toFst,
  toSnd,
  traverseToFst,
  traverseToSnd,
  withFst,
  withSnd,
  create,
  mapBoth,
  fanout,
  getEq,
} from "../src/Tuple"
import { increment } from "../src/Number"
import { constant, flow, identity, pipe } from "fp-ts/function"
import { bimap, swap } from "fp-ts/Tuple"
import * as O from "fp-ts/Option"
import fc from "fast-check"
import * as Str from "fp-ts/string"

const nonMaxNumber = fc.integer({ max: Number.MAX_SAFE_INTEGER - 1 })

describe("Tuple", () => {
  describe("dup", () => {
    const f = dup

    it("duplicates the input", () => {
      fc.assert(fc.property(fc.anything(), x => expect(f(x)).toEqual([x, x])))
    })
  })

  describe("toFst", () => {
    const f = toFst
    const g = f(increment)

    it("applies the function and returns both input and output", () => {
      fc.assert(
        fc.property(nonMaxNumber, n => expect(g(n)).toEqual([increment(n), n])),
      )
    })

    it("is the dual of toSnd", () => {
      fc.assert(
        fc.property(nonMaxNumber, n =>
          expect(g(n)).toEqual(pipe(n, toSnd(increment), swap)),
        ),
      )
    })
  })

  describe("toSnd", () => {
    const f = toSnd
    const g = f(increment)

    it("applies the function and returns both input and output", () => {
      fc.assert(
        fc.property(nonMaxNumber, n => expect(g(n)).toEqual([n, increment(n)])),
      )
    })

    it("is the dual of toFst", () => {
      fc.assert(
        fc.property(nonMaxNumber, n =>
          expect(g(n)).toEqual(pipe(n, toFst(increment), swap)),
        ),
      )
    })
  })

  describe("traverseToFst", () => {
    const f = traverseToFst(O.Functor)

    it("preserves functor's sanctity", () => {
      expect(f(constant(O.none))(123)).toEqual(O.none)
    })

    it("is equivalent to a functorial toFst", () => {
      fc.assert(
        fc.property(nonMaxNumber, n =>
          expect(pipe(n, f(flow(increment, O.some)))).toEqual(
            pipe(n, toFst(increment), O.some),
          ),
        ),
      )
    })
  })

  describe("traverseToSnd", () => {
    const f = traverseToSnd(O.Functor)

    it("preserves functor's sanctity", () => {
      expect(f(constant(O.none))(123)).toEqual(O.none)
    })

    it("is equivalent to a functorial toSnd", () => {
      fc.assert(
        fc.property(nonMaxNumber, n =>
          expect(pipe(n, f(flow(increment, O.some)))).toEqual(
            pipe(n, toSnd(increment), O.some),
          ),
        ),
      )
    })
  })

  describe("withFst", () => {
    const f = withFst

    it("constructs a tuple in order of arguments", () => {
      expect(f(1)(2)).toEqual([1, 2])
    })
  })

  describe("withSnd", () => {
    const f = withSnd

    it("constructs a tuple in reverse order of arguments", () => {
      expect(f(1)(2)).toEqual([2, 1])
    })
  })

  describe("create", () => {
    const f = create

    it("is equivalent to identity at runtime", () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), (x, y) =>
          expect(f([x, y])).toEqual([x, y]),
        ),
      )
    })
  })

  describe("mapBoth", () => {
    const f = mapBoth

    it("returns identity on identity input", () => {
      fc.assert(
        fc.property(fc.string(), fc.string(), (l, r) =>
          expect(f(identity)([l, r])).toEqual([l, r]),
        ),
      )
    })

    it("maps both sides", () => {
      const g = O.some

      fc.assert(
        fc.property(fc.string(), fc.string(), (l, r) =>
          expect(f(g)([l, r])).toEqual([g(l), g(r)]),
        ),
      )
    })

    it("is equivalent to doubly applied bimap", () => {
      const g = O.some

      fc.assert(
        fc.property(fc.string(), fc.string(), (l, r) =>
          expect(f(g)([l, r])).toEqual(bimap(g, g)([l, r])),
        ),
      )
    })
  })

  describe("fanout", () => {
    const f = fanout

    it("calls both provided functions and returns their outputs in order", () => {
      fc.assert(
        fc.property(fc.string(), x =>
          expect(fanout(O.of)(constant("foo"))(x)).toEqual([O.of(x), "foo"]),
        ),
      )
      expect(f)
    })
  })

  describe("getEq", () => {
    it("checks both values in terms of AND", () => {
      const { equals: f } = getEq(Str.Eq)(Str.Eq)

      expect(f(["foo", "foo"], ["foo", "foo"])).toBe(true)
      expect(f(["foo", "foo"], ["bar", "foo"])).toBe(false)
      expect(f(["foo", "foo"], ["foo", "bar"])).toBe(false)
      expect(f(["foo", "bar"], ["baz", "oof"])).toBe(false)
    })

    it("checks second component lazily", () => {
      const { equals: f } = getEq(Str.Eq)({
        equals: () => {
          // eslint-disable-next-line functional/no-throw-statements
          throw "evaluated second component"
        },
      })

      expect(f(["foo", "foo"], ["bar", "foo"])).toBe(false)
    })
  })
})
