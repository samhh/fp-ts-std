import {
  length,
  elemFlipped,
  any,
  all,
  none,
  join,
  pluckFirst,
  upsert,
  getDisorderedEq,
  insertMany,
  dropRepeats,
  startsWith,
  endsWith,
  without,
  cartesian,
  sum,
  product,
  aperture,
  slice,
  reject,
  moveFrom,
  moveTo,
  countBy,
  dropRightWhile,
  mean,
} from "../src/Array"
import * as O from "fp-ts/Option"
import * as A from "fp-ts/Array"
import { contramap as eqContramap, eqNumber } from "fp-ts/Eq"
import { contramap as ordContramap, max, ordNumber } from "fp-ts/Ord"
import {
  constant,
  constFalse,
  constTrue,
  flow,
  identity,
  pipe,
  Predicate,
} from "fp-ts/function"
import fc from "fast-check"
import { fold, monoidSum } from "fp-ts/Monoid"
import { split } from "../src/String"
import { NonEmptyArray } from "fp-ts/NonEmptyArray"
import { values } from "../src/Record"

describe("Array", () => {
  describe("length", () => {
    const f = length

    it("returns length of array", () => {
      expect(f([])).toBe(0)
      expect(f([1, 2, 3])).toBe(3)
    })

    it("returned value is always non-negative", () => {
      fc.assert(fc.property(fc.array(fc.anything()), xs => f(xs) >= 0))
    })
  })

  describe("elemFlipped", () => {
    const f = elemFlipped(eqNumber)

    it("finds the element", () => {
      expect(f([])(0)).toBe(false)
      expect(f([1, 2, 3])(2)).toBe(true)
      expect(f([1, 2, 3])(4)).toBe(false)
    })
  })

  describe("any", () => {
    const f = any<number>(n => n === 5)

    it("returns false for empty input array", () => {
      expect(f([])).toBe(false)
    })

    it("returns true if any predicate succeeds", () => {
      expect(f([5])).toBe(true)
      expect(f([3, 5])).toBe(true)
      expect(f([5, 3])).toBe(true)
      expect(f([5, 5])).toBe(true)
    })

    it("returns false if all predicates fail", () => {
      expect(f([3])).toBe(false)
      expect(f([3, 3])).toBe(false)
    })
  })

  describe("all", () => {
    const f = all<number>(n => n === 5)

    it("returns true for empty input array", () => {
      expect(f([])).toBe(true)
    })

    it("returns true if all predicates succeed", () => {
      expect(f([5])).toBe(true)
      expect(f([5, 5])).toBe(true)
    })

    it("returns false if any predicates fail", () => {
      expect(f([3])).toBe(false)
      expect(f([3, 3])).toBe(false)
      expect(f([3, 5])).toBe(false)
      expect(f([5, 3])).toBe(false)
    })
  })

  describe("none", () => {
    const f = none<number>(n => n === 5)

    it("returns true for empty input array", () => {
      expect(f([])).toBe(true)
    })

    it("returns true if all predicates fail", () => {
      expect(f([4])).toBe(true)
      expect(f([4, 6])).toBe(true)
    })

    it("returns false if any predicates succeed", () => {
      expect(f([5])).toBe(false)
      expect(f([4, 5])).toBe(false)
    })
  })

  describe("join", () => {
    const delim = ","
    const f = join(delim)

    it("joins", () => {
      expect(f([])).toBe("")
      expect(f(["x"])).toBe("x")
      expect(f(["x", "yz"])).toBe("x,yz")

      fc.assert(
        fc.property(fc.array(fc.string()), xs => {
          const countDelims = flow(
            split(""),
            A.filter(c => c === delim),
            length,
          )

          const countDelimsA = flow(A.map(countDelims), fold(monoidSum))

          return (
            countDelims(f(xs)) ===
            countDelimsA(xs) + max(ordNumber)(0, length(xs) - 1)
          )
        }),
      )
    })
  })

  describe("pluckFirst", () => {
    const p: Predicate<number> = x => x % 2 === 1
    const f = pluckFirst(p)

    it("finds the item", () => {
      expect(f([2, 3, 4])).toEqual([O.some(3), [2, 4]])
    })

    it('does not "find" an incorrect item', () => {
      expect(f([2, 4, 6])).toEqual([O.none, [2, 4, 6]])
    })

    it("removes only the first, left-most match", () => {
      expect(f([2, 3, 4, 5])).toEqual([O.some(3), [2, 4, 5]])
    })

    it("does not mutate input", () => {
      const xs = [2, 3, 4]
      // eslint-disable-next-line functional/no-expression-statement
      f(xs)
      expect(xs).toEqual([2, 3, 4])
    })
  })

  describe("upsert", () => {
    type Thing = { id: number; name: string }
    const eqThing = eqContramap<number, Thing>(x => x.id)(eqNumber)

    const x1: Thing = { id: 1, name: "x" }
    const x2: Thing = { id: 1, name: "x2" }
    const y: Thing = { id: 2, name: "y" }
    const z: Thing = { id: 3, name: "z" }

    const f = upsert
    const g = f(eqThing)(x2)

    it("appends non-present item", () => {
      expect(g([])).toEqual([x2])
      expect(g([y, z])).toEqual([y, z, x2])
    })

    it("updates present item in-place", () => {
      expect(g([x1, y])).toEqual([x2, y])
      expect(g([y, x1])).toEqual([y, x2])
    })

    it("does not mutate input", () => {
      const xs = [{ ...x1 }]
      // eslint-disable-next-line functional/no-expression-statement
      g(xs)
      expect(xs).toEqual([{ ...x1 }])
    })

    it("always returns a non-empty array", () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer()),
          fc.integer(),
          (xs, y) => !!f(eqNumber)(y)(xs).length,
        ),
      )
    })
  })

  describe("getDisorderedEq", () => {
    type Thing = { id: number; name: string }
    const ordThing = ordContramap<number, Thing>(x => x.id)(ordNumber)

    const y: Thing = { id: 1, name: "x" }
    const z: Thing = { id: 2, name: "y" }
    const zAlt: Thing = { id: 2, name: "changed" }

    const f = getDisorderedEq(ordThing).equals

    it("its equality using Eq", () => {
      expect(f([], [])).toBe(true)
      expect(f([y], [y])).toBe(true)
      expect(f([z], [zAlt])).toBe(true)
      expect(f([y, z], [y, z])).toBe(true)
      expect(f([y, y], [y, z])).toBe(false)
      expect(f([y, y], [y])).toBe(false)
    })

    it("disregards initial indices", () => {
      expect(f([y, z], [z, y])).toBe(true)
    })
  })

  describe("insertMany", () => {
    const f = insertMany
    const g = f(1)(["a", "b"])

    it("returns None if index is out of bounds", () => {
      expect(g([])).toEqual(O.none)
    })

    it("returns updated array wrapped in Some if index is okay", () => {
      expect(f(0)(["x"])([])).toEqual(O.some(["x"]))
      expect(g(["x"])).toEqual(O.some(["x", "a", "b"]))
      expect(g(["x", "y"])).toEqual(O.some(["x", "a", "b", "y"]))

      fc.assert(
        fc.property(
          fc.array(fc.anything(), 1, 5) as fc.Arbitrary<NonEmptyArray<unknown>>,
          fc.integer(0, 10),
          (xs, i) => O.isSome(f(i)(xs)(xs)) === i <= length(xs),
        ),
      )

      fc.assert(
        fc.property(fc.array(fc.string(), 1, 20), xs =>
          expect(pipe(g(xs), O.map(length))).toEqual(O.some(length(xs) + 2)),
        ),
      )
    })

    it("does not mutate input", () => {
      const xs: NonEmptyArray<number> = [1, 2, 3]
      const ys: NonEmptyArray<number> = [4, 5]
      const zs = f(1)(ys)(xs)

      expect(xs).toEqual([1, 2, 3])
      expect(ys).toEqual([4, 5])
      expect(zs).toEqual(O.some([1, 4, 5, 2, 3]))
    })
  })

  describe("dropRepeats", () => {
    const f = dropRepeats(eqNumber)

    it("removes consecutive duplicates if any", () => {
      expect(f([])).toEqual([])
      expect(f([1, 2, 3])).toEqual([1, 2, 3])
      expect(f([1, 2, 2, 3, 2, 4, 4])).toEqual([1, 2, 3, 2, 4])
    })

    it("never returns a larger array", () => {
      fc.assert(
        fc.property(fc.array(fc.integer()), xs => f(xs).length <= length(xs)),
      )
    })

    it("never introduces new elements", () => {
      const g = A.uniq(eqNumber)

      fc.assert(
        fc.property(fc.array(fc.integer()), xs =>
          pipe(xs, f, g, all(elemFlipped(eqNumber)(g(xs)))),
        ),
      )
    })
  })

  describe("startsWith", () => {
    const f = startsWith(eqNumber)

    it("returns true for empty subarray", () => {
      fc.assert(fc.property(fc.array(fc.integer()), xs => f([])(xs)))
    })

    it("checks start of array for subarray", () => {
      expect(f([1])([1, 2, 3])).toBe(true)
      expect(f([3])([1, 2, 3])).toBe(false)

      fc.assert(
        fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (xs, ys) =>
          f(xs)(xs.concat(ys)),
        ),
      )
    })
  })

  describe("endsWith", () => {
    const f = endsWith(eqNumber)

    it("returns true for empty subarray", () => {
      fc.assert(fc.property(fc.array(fc.integer()), xs => f([])(xs)))
    })

    it("checks end of array for subarray", () => {
      expect(f([3])([1, 2, 3])).toBe(true)
      expect(f([1])([1, 2, 3])).toBe(false)

      fc.assert(
        fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (xs, ys) =>
          f(xs)(ys.concat(xs)),
        ),
      )
    })
  })

  describe("without", () => {
    const f = without(eqNumber)

    it("removes numbers present in first input array", () => {
      const g = f([4, 5])

      expect(g([3, 4])).toEqual([3])
      expect(g([4, 5])).toEqual([])
      expect(g([4, 5, 6])).toEqual([6])
      expect(g([3, 4, 5, 6])).toEqual([3, 6])
      expect(g([4, 3, 4, 5, 6, 5])).toEqual([3, 6])

      fc.assert(
        fc.property(fc.array(fc.integer()), xs =>
          expect(f(xs)(xs)).toEqual(A.empty),
        ),
      )
    })
  })

  describe("cartesian", () => {
    const f = cartesian

    it("returns the Cartesian product", () => {
      expect(f([1, 2])(["a", "b", "c"])).toEqual([
        [1, "a"],
        [1, "b"],
        [1, "c"],
        [2, "a"],
        [2, "b"],
        [2, "c"],
      ])
    })

    it("output array length is the product of input array lengths", () => {
      fc.assert(
        fc.property(
          fc.array(fc.anything()),
          fc.array(fc.anything()),
          (xs, ys) => f(xs)(ys).length === length(xs) * ys.length,
        ),
      )
    })
  })

  describe("sum", () => {
    const f = sum

    it("returns addition identity (zero) for empty input", () => {
      expect(f([])).toBe(0)
    })

    it("sums non-empty input", () => {
      expect(f([25, 3, 10])).toBe(38)
      expect(f([-3, 2])).toBe(-1)
      expect(f([2.5, 3.2])).toBe(5.7)

      fc.assert(
        fc.property(
          fc.array(fc.integer()),
          xs => f(xs) === xs.reduce((acc, val) => acc + val, 0),
        ),
      )
    })
  })

  describe("product", () => {
    const f = product

    it("returns multiplication identity (one) for empty input", () => {
      expect(f([])).toBe(1)
    })

    it("calculates product of non-empty input", () => {
      expect(f([4, 2, 3])).toBe(24)
      expect(f([5])).toBe(5)
      expect(f([1.5, -5])).toBe(-7.5)

      fc.assert(
        fc.property(
          fc.array(fc.integer()),
          xs => f(xs) === xs.reduce((acc, val) => acc * val, 1),
        ),
      )
    })
  })

  describe("aperture", () => {
    const f = aperture

    it("returns empty array for empty array input", () => {
      expect(f(0)([])).toEqual([])

      fc.assert(fc.property(fc.integer(0, 100), n => !f(n)([]).length))
    })

    it("returns empty array for non-positive input number", () => {
      fc.assert(
        fc.property(
          fc.integer(0),
          fc.array(fc.anything()),
          (n, xs) => !f(n)(xs).length,
        ),
      )
    })

    it("returns empty array for tuple length larger than input array length", () => {
      fc.assert(
        fc.property(
          fc.array(fc.anything()),
          xs => !f(length(xs) + 1)(xs).length,
        ),
      )
    })

    it("returns array of tuples of consecutive items", () => {
      expect(f(1)([1, 2, 3, 4])).toEqual([[1], [2], [3], [4]])
      expect(f(2)([1, 2, 3, 4])).toEqual([
        [1, 2],
        [2, 3],
        [3, 4],
      ])
      expect(f(3)([1, 2, 3, 4])).toEqual([
        [1, 2, 3],
        [2, 3, 4],
      ])
      expect(f(4)([1, 2, 3, 4])).toEqual([[1, 2, 3, 4]])
    })

    it("output length is input length - n + 1", () => {
      fc.assert(
        fc.property(
          fc.array(fc.anything()),
          fc.integer(1, 100),
          (xs, n) => f(n)(xs).length === max(ordNumber)(0, length(xs) - n + 1),
        ),
      )
    })
  })

  describe("slice", () => {
    const f = slice

    it("behaves identically to Array.prototype.slice", () => {
      fc.assert(
        fc.property(
          fc.array(fc.anything()),
          fc.integer(),
          fc.integer(),
          (xs, start, end) =>
            expect(f(start)(end)(xs)).toEqual(xs.slice(start, end)),
        ),
      )
    })
  })

  describe("reject", () => {
    const p: Predicate<number> = n => n % 2 === 0
    const f = reject(p)

    it("filters out items for which the predicate holds", () => {
      expect(f([1, 2, 3, 4])).toEqual([1, 3])
    })

    it("is the inverse of filter", () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer()),
          xs => A.filter(p)(xs).length + f(xs).length === length(xs),
        ),
      )
    })
  })

  describe("moveFrom", () => {
    const f = moveFrom

    it("returns unmodified array provided same indices (in bounds)", () => {
      const n = 10

      fc.assert(
        fc.property(
          fc.array(fc.anything(), 1, n),
          fc.integer(0, n - 1),
          (xs, i) => i >= length(xs) || expect(f(i)(i)(xs)).toEqual(O.some(xs)),
        ),
      )
    })

    it("returns None if source is out of bounds", () => {
      fc.assert(
        fc.property(fc.array(fc.anything()), xs =>
          expect(f(length(xs))(0)(xs)).toEqual(O.none),
        ),
      )
    })

    it("returns None if target is out of bounds", () => {
      fc.assert(
        fc.property(fc.array(fc.anything()), xs =>
          expect(f(0)(length(xs))(xs)).toEqual(O.none),
        ),
      )
    })

    it("moves source to target", () => {
      expect(f(0)(1)(["a", "b", "c"])).toEqual(O.some(["b", "a", "c"]))
      expect(f(1)(0)(["a", "b", "c"])).toEqual(O.some(["b", "a", "c"]))

      const n = 10

      fc.assert(
        fc.property(
          fc.array(fc.anything(), n, n),
          fc.integer(0, n - 1),
          fc.integer(0, n - 1),
          (xs, i, j) => O.isSome(f(i)(j)(xs)),
        ),
      )
    })

    it("returns the same array size", () => {
      const n = 10

      fc.assert(
        fc.property(
          fc.array(fc.anything(), n, n),
          fc.integer(0, n - 1),
          fc.integer(0, n - 1),
          (xs, i, j) =>
            pipe(
              f(i)(j)(xs),
              O.exists(ys => length(ys) === n),
            ),
        ),
      )
    })

    it("sibling indices are interchangeable", () => {
      const n = 10

      fc.assert(
        fc.property(
          fc.array(fc.anything(), n, n),
          fc.integer(0, n - 2),
          (xs, i) => expect(f(i)(i + 1)(xs)).toEqual(f(i + 1)(i)(xs)),
        ),
      )
    })
  })

  describe("moveTo", () => {
    const f = moveTo

    it("returns unmodified array provided same indices (in bounds)", () => {
      const n = 10

      fc.assert(
        fc.property(
          fc.array(fc.anything(), 1, n),
          fc.integer(0, n - 1),
          (xs, i) => i >= length(xs) || expect(f(i)(i)(xs)).toEqual(O.some(xs)),
        ),
      )
    })

    it("returns None if source is out of bounds", () => {
      fc.assert(
        fc.property(fc.array(fc.anything()), xs =>
          expect(f(0)(length(xs))(xs)).toEqual(O.none),
        ),
      )
    })

    it("returns None if target is out of bounds", () => {
      fc.assert(
        fc.property(fc.array(fc.anything()), xs =>
          expect(f(length(xs))(0)(xs)).toEqual(O.none),
        ),
      )
    })

    it("moves source to target", () => {
      expect(f(0)(1)(["a", "b", "c"])).toEqual(O.some(["b", "a", "c"]))
      expect(f(1)(0)(["a", "b", "c"])).toEqual(O.some(["b", "a", "c"]))

      const n = 10

      fc.assert(
        fc.property(
          fc.array(fc.anything(), n, n),
          fc.integer(0, n - 1),
          fc.integer(0, n - 1),
          (xs, i, j) => O.isSome(f(i)(j)(xs)),
        ),
      )
    })

    it("returns the same array size", () => {
      const n = 10

      fc.assert(
        fc.property(
          fc.array(fc.anything(), n, n),
          fc.integer(0, n - 1),
          fc.integer(0, n - 1),
          (xs, i, j) =>
            pipe(
              f(i)(j)(xs),
              O.exists(ys => length(ys) === n),
            ),
        ),
      )
    })

    it("sibling indices are interchangeable", () => {
      const n = 10

      fc.assert(
        fc.property(
          fc.array(fc.anything(), n, n),
          fc.integer(0, n - 2),
          (xs, i) => expect(f(i)(i + 1)(xs)).toEqual(f(i + 1)(i)(xs)),
        ),
      )
    })
  })

  describe("countBy", () => {
    const f = countBy

    it("gets key from input function and counts", () => {
      expect(f(constant("x"))(["a", "b", "c"])).toEqual({ x: 3 })
      expect(f<string>(identity)(["a", "b", "c"])).toEqual({ a: 1, b: 1, c: 1 })
    })

    it("counts the same summed number as the length of the array", () => {
      fc.assert(
        fc.property(
          fc.array(fc.string()),
          xs => pipe(xs, f(identity), values, sum) === xs.length,
        ),
      )
    })

    it("all numbers are above zero", () => {
      fc.assert(
        fc.property(
          fc.array(fc.string()),
          flow(
            f(identity),
            values,
            all(n => n > 0),
          ),
        ),
      )
    })
  })

  describe("dropRightWhile", () => {
    const f = dropRightWhile

    it("removes elements from the right until predicate fails", () => {
      expect(f<string>(x => x === "a")(["a", "a", "b", "a", "a"])).toEqual([
        "a",
        "a",
        "b",
      ])
    })

    it("constTrue returns empty array", () => {
      fc.assert(
        fc.property(fc.array(fc.anything()), xs =>
          expect(f(constTrue)(xs)).toEqual([]),
        ),
      )
    })

    it("constFalse returns original array", () => {
      fc.assert(
        fc.property(fc.array(fc.anything()), xs =>
          expect(f(constFalse)(xs)).toEqual(xs),
        ),
      )
    })
  })

  describe("mean", () => {
    const f = mean

    it("calculates the mean", () => {
      expect(f([2, 7, 9])).toBe(6)

      fc.assert(
        fc.property(
          fc.integer(1, 50),
          fc.integer(),
          (x, y) => f(A.replicate(x, y) as NonEmptyArray<number>) === y,
        ),
      )
    })
  })
})
