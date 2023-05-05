import {
  Enum,
  fromTo,
  fromThenTo,
  upFromIncl,
  upFromExcl,
  downFromIncl,
  downFromExcl,
  defaultCardinality,
  universe,
  inverseMap,
  getUnsafeConstantEnum,
  fromProductEnumFormula,
} from "../src/Enum"
import fc from "fast-check"
import { constant, flow, pipe } from "fp-ts/function"
import * as O from "fp-ts/Option"
import * as NEA from "fp-ts/NonEmptyArray"
import NonEmptyArray = NEA.NonEmptyArray
import * as A from "fp-ts/Array"
import { EnumInt } from "../src/Number"
import { Show as ShowBool, Ord as OrdBool } from "fp-ts/boolean"
import { Enum as EnumBool } from "../src/Boolean"
import { curry2 } from "../src/Function"
import { Bounded } from "fp-ts/Bounded"
import { EQ } from "../src/Ordering"
import * as Ord from "fp-ts/Ord"
import * as Num from "fp-ts/number"
import * as Str from "fp-ts/string"
import * as L from "../src/Lazy"

const BoundedNull: Bounded<null> = {
  equals: constant(true),
  compare: constant(EQ),
  top: null,
  bottom: null,
}

const EnumNull: Enum<null> = {
  ...BoundedNull,
  succ: constant(O.none),
  pred: constant(O.none),
  toEnum: n => (n === 0 ? O.some(null) : O.none),
  fromEnum: constant(0),
  cardinality: L.of(1),
}

describe("Enum", () => {
  describe("fromTo", () => {
    const f = fromTo(EnumInt)

    const notTooBig: fc.IntegerConstraints = { min: -100, max: 100 }
    const pair = fc.tuple(fc.integer(notTooBig), fc.integer(notTooBig))
    const validPair = pair.filter(([x, y]) => x < y)

    it("never throws", () => {
      fc.assert(
        fc.property(pair, ([x, y]) => {
          /* eslint-disable functional/no-expression-statements */
          f(x)(x)
          f(y)(y)
          f(y)(x)
          /* eslint-enable functional/no-expression-statements */
        }),
      )
    })

    it("can reimplement range", () => {
      const g = curry2(NEA.range)

      fc.assert(
        fc.property(validPair, ([x, y]) => expect(f(x)(y)).toEqual(g(x)(y))),
      )
    })
  })

  describe("fromThenTo", () => {
    const f = fromThenTo(EnumInt)

    const notTooBig: fc.IntegerConstraints = { min: -100, max: 100 }
    const pair = fc.tuple(fc.integer(notTooBig), fc.integer(notTooBig))
    const triple = fc.tuple(
      fc.integer(notTooBig),
      fc.integer(notTooBig),
      fc.integer(notTooBig),
    )
    const validPair = pair.filter(([x, y]) => x < y)

    it("works", () => {
      expect(f(0)(2)(6)).toEqual([0, 2, 4, 6])
      expect(f(0)(3)(5)).toEqual([0, 3])

      expect(f(-6)(-4)(0)).toEqual([-6, -4, -2, 0])
      expect(f(-5)(-2)(0)).toEqual([-5, -2])
    })

    it("does not sequence given non-positive step", () => {
      expect(f(0)(0)(6)).toEqual([0])
      expect(f(0)(-2)(6)).toEqual([0])
    })

    it("does not sequence in descending order", () => {
      expect(f(0)(2)(-6)).toEqual([0])
    })

    it("never throws", () => {
      fc.assert(
        fc.property(triple, ([x, y, z]) => {
          // eslint-disable-next-line functional/no-expression-statements
          f(x)(y)(z)
        }),
      )
    })

    it("always returns a non-empty array", () => {
      fc.assert(fc.property(triple, ([x, y, z]) => !!f(x)(y)(z).length))
    })

    it("can reimplement range", () => {
      const g =
        (start: number) =>
        (end: number): NonEmptyArray<number> =>
          f(start)(start + 1)(end)
      const h = curry2(NEA.range)

      expect(g(-1)(0)).toEqual([-1, 0])
      expect(h(-1)(0)).toEqual([-1, 0])
      fc.assert(
        fc.property(validPair, ([x, y]) => expect(g(x)(y)).toEqual(h(x)(y))),
      )
    })
  })

  describe("upFromIncl", () => {
    const f = upFromIncl(EnumInt)

    it("returns every ordered member until max including the start", () => {
      expect(f(Number.MAX_SAFE_INTEGER - 5)).toEqual([
        Number.MAX_SAFE_INTEGER - 5,
        Number.MAX_SAFE_INTEGER - 4,
        Number.MAX_SAFE_INTEGER - 3,
        Number.MAX_SAFE_INTEGER - 2,
        Number.MAX_SAFE_INTEGER - 1,
        Number.MAX_SAFE_INTEGER - 0,
      ])
    })
  })

  describe("upFromExcl", () => {
    const f = upFromExcl(EnumInt)

    it("returns every ordered member until max excluding the start", () => {
      expect(f(Number.MAX_SAFE_INTEGER - 5)).toEqual([
        Number.MAX_SAFE_INTEGER - 4,
        Number.MAX_SAFE_INTEGER - 3,
        Number.MAX_SAFE_INTEGER - 2,
        Number.MAX_SAFE_INTEGER - 1,
        Number.MAX_SAFE_INTEGER - 0,
      ])
    })
  })

  describe("downFromIncl", () => {
    const f = downFromIncl(EnumInt)

    it("returns every reverse ordered member until min including the end", () => {
      expect(f(Number.MIN_SAFE_INTEGER + 5)).toEqual([
        Number.MIN_SAFE_INTEGER + 5,
        Number.MIN_SAFE_INTEGER + 4,
        Number.MIN_SAFE_INTEGER + 3,
        Number.MIN_SAFE_INTEGER + 2,
        Number.MIN_SAFE_INTEGER + 1,
        Number.MIN_SAFE_INTEGER + 0,
      ])
    })
  })

  describe("downFromExcl", () => {
    const f = downFromExcl(EnumInt)

    it("returns every reverse ordered member until min excluding the end", () => {
      expect(f(Number.MIN_SAFE_INTEGER + 5)).toEqual([
        Number.MIN_SAFE_INTEGER + 4,
        Number.MIN_SAFE_INTEGER + 3,
        Number.MIN_SAFE_INTEGER + 2,
        Number.MIN_SAFE_INTEGER + 1,
        Number.MIN_SAFE_INTEGER + 0,
      ])
    })
  })

  describe("defaultCardinality", () => {
    const f = defaultCardinality

    it("calculates the cardinality for types with a single member", () => {
      const n = f(EnumNull)

      expect(n).toBe(1)
    })

    it("calculates the cardinality for types with multiple members", () => {
      expect(f(EnumBool)).toBe(2)

      type BoolOrNull = boolean | null

      const BoundedBoolOrNull: Bounded<BoolOrNull> = {
        equals: (x, y) => x === y,
        compare: Ord.contramap<number, BoolOrNull>(x => {
          // eslint-disable-next-line functional/no-conditional-statements
          switch (x) {
            case false:
              return 0
            case true:
              return 1
            case null:
              return 2
          }
        })(Num.Ord).compare,
        top: null,
        bottom: false,
      }

      const EnumBoolOrNull: Enum<BoolOrNull> = {
        ...BoundedBoolOrNull,
        succ: x => {
          // eslint-disable-next-line functional/no-conditional-statements
          switch (x) {
            case false:
              return O.some(true)
            case true:
              return O.some(null)
            case null:
              return O.none
          }
        },
        pred: x => {
          // eslint-disable-next-line functional/no-conditional-statements
          switch (x) {
            case false:
              return O.none
            case true:
              return O.some(false)
            case null:
              return O.some(true)
          }
        },
        toEnum: n => {
          // eslint-disable-next-line functional/no-conditional-statements
          switch (n) {
            case 0:
              return O.some(false)
            case 1:
              return O.some(true)
            case 2:
              return O.some(null)
            default:
              return O.none
          }
        },
        fromEnum: x => {
          // eslint-disable-next-line functional/no-conditional-statements
          switch (x) {
            case false:
              return 0
            case true:
              return 1
            case null:
              return 2
          }
        },
        cardinality: L.of(3),
      }

      const n = f(EnumBoolOrNull)

      expect(n).toBe(3)
    })

    it("does not use the cardinality member if present", () => {
      const E: Enum<null> = { ...EnumNull, cardinality: L.of(123) }
      const n = f(E)

      expect(n).toBe(1)
    })
  })

  describe("universe", () => {
    const f = universe

    it("lifts unary type member into non-empty array", () => {
      expect(f(EnumNull)).toEqual([null])
    })

    it("enumerates every member of non-unary types in ascending order based upon Bounded bounds", () => {
      expect(f(EnumBool)).toEqual([false, true])

      const BoundedIntLimited: Bounded<number> = {
        ...Num.Ord,
        bottom: 1,
        top: 10,
      }

      const EnumIntLimited: Enum<number> = {
        ...EnumInt,
        ...BoundedIntLimited,
      }

      expect(f(EnumIntLimited)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    })
  })

  describe("inverseMap", () => {
    const f = inverseMap

    it("works", () => {
      const g = f(EnumBool)(Str.Eq)(ShowBool.show)

      expect(g("true")).toEqual(O.some(true))
      expect(g("false")).toEqual(O.some(false))
      expect(g("foo")).toEqual(O.none)
    })
  })

  describe("getUnsafeConstantEnum", () => {
    const f = getUnsafeConstantEnum

    it("never throws in succ or pred", () => {
      fc.assert(
        fc.property(
          fc.array(fc.string(), { maxLength: 100 }),
          fc.string(),
          (xs, y) => {
            const E = f(Str.Ord)(xs as NonEmptyArray<string>)

            /* eslint-disable functional/no-expression-statements */
            E.succ(y)
            E.pred(y)
            /* eslint-enable functional/no-expression-statements */
          },
        ),
      )
    })

    it("never throws in toEnum", () => {
      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 1, maxLength: 100 }),
          fc.integer(),
          (xs, y) => {
            const E = f(Str.Ord)(xs as NonEmptyArray<string>)

            // eslint-disable-next-line functional/no-expression-statements
            E.toEnum(y)
          },
        ),
      )
    })

    it("is total in fromEnum if every member is provided", () => {
      const asc = f(OrdBool)([false, true])
      const desc = f(OrdBool)([true, false])

      expect(asc.fromEnum(true)).toBe(1)
      expect(asc.fromEnum(false)).toBe(0)

      expect(desc.fromEnum(true)).toBe(0)
      expect(desc.fromEnum(false)).toBe(1)
    })

    it("finds present member in partial input in fromEnum", () => {
      const E = f(Str.Ord)(["foo", "bar"])

      expect(E.fromEnum("foo")).toBe(0)
      expect(E.fromEnum("bar")).toBe(1)
    })

    it("throws with expected message in fromEnum if member not present", () => {
      const E = f(Str.Ord)(["foo"])

      expect(() => E.fromEnum("bar")).toThrow(/getUnsafeConstantEnum/)
    })
  })

  describe("fromProductEnumFormula", () => {
    const f = (radices: Array<number>): ((values: Array<number>) => number) =>
      flow(A.zip(radices), fromProductEnumFormula)

    it("tolerates empty inputs", () => {
      expect(f([])([])).toEqual(0)
      expect(f([1, 2, 3])([])).toEqual(0)
      expect(f([])([1, 2, 3])).toEqual(0)
    })

    // TODO bad inputs e.g. negative

    it("works", () => {
      expect(f([3, 2])([0, 0])).toBe(0)
      expect(f([3, 2])([2, 0])).toBe(4)
      expect(f([3, 3, 3])([2, 2, 0])).toBe(24)
      expect(f([11, 5, 13, 9])([3, 4, 3, 7])).toBe(2257)
      expect(f([19, 12, 16, 13])([12, 0, 0, 5])).toBe(29957)
    })

    it("calculates Gregorian calendrical seconds", () => {
      const g = f([7, 24, 60, 60])

      expect(g([0, 0, 0, 0])).toBe(0)
      expect(g([0, 0, 0, 1])).toBe(1)
      expect(g([0, 0, 1, 0])).toBe(60)
      expect(g([0, 1, 0, 0])).toBe(60 * 60)
      expect(g([1, 0, 0, 0])).toBe(24 * 60 * 60)
      expect(g([0, 2, 14, 27])).toBe(2 * 60 * 60 + 14 * 60 + 27)
      expect(g([0, 12, 59, 0])).toBe(12 * 60 * 60 + 59 * 60)
      expect(g([1, 0, 0, 1])).toBe(24 * 60 * 60 + 1)
    })
  })
})
