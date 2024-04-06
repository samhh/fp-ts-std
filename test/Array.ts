import { describe, expect, it } from "@jest/globals"
import fc from "fast-check"
import * as A from "fp-ts/Array"
import * as E from "fp-ts/Either"
import { Endomorphism } from "fp-ts/Endomorphism"
import { contramap as eqContramap } from "fp-ts/Eq"
import * as IO from "fp-ts/IO"
import { concatAll } from "fp-ts/Monoid"
import * as NEA from "fp-ts/NonEmptyArray"
import { NonEmptyArray } from "fp-ts/NonEmptyArray"
import * as O from "fp-ts/Option"
import { max, contramap as ordContramap } from "fp-ts/Ord"
import { Predicate } from "fp-ts/Predicate"
import * as RA from "fp-ts/ReadonlyArray"
import * as R from "fp-ts/Record"
import * as T from "fp-ts/These"
import { fst, snd } from "fp-ts/Tuple"
import {
	constFalse,
	constTrue,
	constant,
	flow,
	identity,
	pipe,
} from "fp-ts/function"
import * as N from "fp-ts/number"
import { split } from "fp-ts/string"
import {
	allM,
	anyM,
	aperture,
	cartesian,
	countBy,
	dropAt,
	dropRepeats,
	dropRightWhile,
	elemV,
	endsWith,
	extractAt,
	filterA,
	fromIterable,
	fromReadonly,
	getDisorderedEq,
	insertMany,
	join,
	maximum,
	mean,
	median,
	minimum,
	moveFrom,
	moveTo,
	none,
	pluckFirst,
	product,
	reduceRightWhile,
	reduceWhile,
	reject,
	separateNE,
	slice,
	startsWith,
	sum,
	symmetricDifference,
	takeRightWhile,
	toReadonly,
	transpose,
	upsert,
	without,
	zipAll,
} from "../src/Array"
import { add, decrement } from "../src/Number"
import { values } from "../src/Record"

type IO<A> = IO.IO<A>

describe("Array", () => {
	describe("elemV", () => {
		const f = elemV(N.Eq)

		it("finds the element", () => {
			expect(f([])(0)).toBe(false)
			expect(f([1, 2, 3])(2)).toBe(true)
			expect(f([1, 2, 3])(4)).toBe(false)
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
						RA.filter(c => c === delim),
						RA.size,
					)

					const countDelimsA = flow(RA.map(countDelims), concatAll(N.MonoidSum))

					return (
						countDelims(f(xs)) ===
						countDelimsA(xs) + max(N.Ord)(0, A.size(xs) - 1)
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
			// eslint-disable-next-line functional/no-expression-statements
			f(xs)
			expect(xs).toEqual([2, 3, 4])
		})
	})

	describe("upsert", () => {
		type Thing = { id: number; name: string }
		const eqThing = eqContramap<number, Thing>(x => x.id)(N.Eq)

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
			// eslint-disable-next-line functional/no-expression-statements
			g(xs)
			expect(xs).toEqual([{ ...x1 }])
		})

		it("always returns a non-empty array", () => {
			fc.assert(
				fc.property(
					fc.array(fc.integer()),
					fc.integer(),
					(xs, y) => !!f(N.Eq)(y)(xs).length,
				),
			)
		})
	})

	describe("getDisorderedEq", () => {
		type Thing = { id: number; name: string }
		const ordThing = ordContramap<number, Thing>(x => x.id)(N.Ord)

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
					fc.array(fc.anything(), {
						minLength: 1,
						maxLength: 5,
					}) as fc.Arbitrary<NonEmptyArray<unknown>>,
					fc.integer({ min: 0, max: 10 }),
					(xs, i) => O.isSome(f(i)(xs)(xs)) === i <= A.size(xs),
				),
			)

			fc.assert(
				fc.property(
					fc.array(fc.string(), { minLength: 1, maxLength: 20 }),
					xs =>
						expect(pipe(g(xs), O.map(A.size))).toEqual(O.some(A.size(xs) + 2)),
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
		const f = dropRepeats(N.Eq)

		it("removes consecutive duplicates if any", () => {
			expect(f([])).toEqual([])
			expect(f([1, 2, 3])).toEqual([1, 2, 3])
			expect(f([1, 2, 2, 3, 2, 4, 4])).toEqual([1, 2, 3, 2, 4])
		})

		it("never returns a larger array", () => {
			fc.assert(
				fc.property(fc.array(fc.integer()), xs => f(xs).length <= A.size(xs)),
			)
		})

		it("never introduces new elements", () => {
			const g = A.uniq(N.Eq)

			fc.assert(
				fc.property(fc.array(fc.integer()), xs =>
					pipe(xs, f, g, A.every(elemV(N.Eq)(g(xs)))),
				),
			)
		})
	})

	describe("startsWith", () => {
		const f = startsWith(N.Eq)

		it("returns true for empty subarray", () => {
			fc.assert(fc.property(fc.array(fc.integer()), xs => f([])(xs)))
		})

		it("checks start of array for subarray", () => {
			expect(f([1])([1, 2, 3])).toBe(true)
			expect(f([3])([1, 2, 3])).toBe(false)

			fc.assert(
				fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (xs, ys) =>
					f(xs)(A.concat(ys)(xs)),
				),
			)
		})
	})

	describe("endsWith", () => {
		const f = endsWith(N.Eq)

		it("returns true for empty subarray", () => {
			fc.assert(fc.property(fc.array(fc.integer()), xs => f([])(xs)))
		})

		it("checks end of array for subarray", () => {
			expect(f([3])([1, 2, 3])).toBe(true)
			expect(f([1])([1, 2, 3])).toBe(false)

			fc.assert(
				fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (xs, ys) =>
					f(xs)(A.concat(xs)(ys)),
				),
			)
		})
	})

	describe("without", () => {
		const f = without(N.Eq)

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

		it("output array A.size is the product of input array A.sizes", () => {
			fc.assert(
				fc.property(
					fc.array(fc.anything()),
					fc.array(fc.anything()),
					(xs, ys) => f(xs)(ys).length === A.size(xs) * ys.length,
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

			fc.assert(
				fc.property(fc.integer({ min: 0, max: 100 }), n => !f(n)([]).length),
			)
		})

		it("returns empty array for non-positive input number", () => {
			fc.assert(
				fc.property(
					fc.integer({ max: 0 }),
					fc.array(fc.anything()),
					(n, xs) => !f(n)(xs).length,
				),
			)
		})

		it("returns empty array for tuple A.size larger than input array A.size", () => {
			fc.assert(
				fc.property(
					fc.array(fc.anything()),
					xs => !f(A.size(xs) + 1)(xs).length,
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

		it("output A.size is input A.size - n + 1", () => {
			fc.assert(
				fc.property(
					fc.array(fc.anything()),
					fc.integer({ min: 1, max: 100 }),
					(xs, n) => f(n)(xs).length === max(N.Ord)(0, A.size(xs) - n + 1),
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
					xs => A.filter(p)(xs).length + f(xs).length === A.size(xs),
				),
			)
		})

		it("supports subtyping", () => {
			type A = { n: number }
			type B = A & { x: string }
			const xs: Array<B> = []
			const _ys: Array<B> = reject<A>(constTrue)(xs)
		})
	})

	describe("moveFrom", () => {
		const f = moveFrom

		it("returns unmodified array provided same indices (in bounds)", () => {
			const n = 10

			fc.assert(
				fc.property(
					fc.array(fc.anything(), { minLength: 1, maxLength: n }),
					fc.integer({ min: 0, max: n - 1 }),
					(xs, i) => i >= A.size(xs) || expect(f(i)(i)(xs)).toEqual(O.some(xs)),
				),
			)
		})

		it("returns None if source is out of bounds", () => {
			fc.assert(
				fc.property(fc.array(fc.anything()), xs =>
					expect(f(A.size(xs))(0)(xs)).toEqual(O.none),
				),
			)
		})

		it("returns None if target is out of bounds", () => {
			fc.assert(
				fc.property(fc.array(fc.anything()), xs =>
					expect(f(0)(A.size(xs))(xs)).toEqual(O.none),
				),
			)
		})

		it("moves source to target", () => {
			expect(f(0)(1)(["a", "b", "c"])).toEqual(O.some(["b", "a", "c"]))
			expect(f(1)(0)(["a", "b", "c"])).toEqual(O.some(["b", "a", "c"]))

			const n = 10

			fc.assert(
				fc.property(
					fc.array(fc.anything(), { minLength: n, maxLength: n }),
					fc.integer({ min: 0, max: n - 1 }),
					fc.integer({ min: 0, max: n - 1 }),
					(xs, i, j) => O.isSome(f(i)(j)(xs)),
				),
			)
		})

		it("returns the same array size", () => {
			const n = 10

			fc.assert(
				fc.property(
					fc.array(fc.anything(), { minLength: n, maxLength: n }),
					fc.integer({ min: 0, max: n - 1 }),
					fc.integer({ min: 0, max: n - 1 }),
					(xs, i, j) =>
						pipe(
							f(i)(j)(xs),
							O.exists(ys => A.size(ys) === n),
						),
				),
			)
		})

		it("sibling indices are interchangeable", () => {
			const n = 10

			fc.assert(
				fc.property(
					fc.array(fc.anything(), { minLength: n, maxLength: n }),
					fc.integer({ min: 0, max: n - 2 }),
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
					fc.array(fc.anything(), { minLength: 1, maxLength: n }),
					fc.integer({ min: 0, max: n - 1 }),
					(xs, i) => i >= A.size(xs) || expect(f(i)(i)(xs)).toEqual(O.some(xs)),
				),
			)
		})

		it("returns None if source is out of bounds", () => {
			fc.assert(
				fc.property(fc.array(fc.anything()), xs =>
					expect(f(0)(A.size(xs))(xs)).toEqual(O.none),
				),
			)
		})

		it("returns None if target is out of bounds", () => {
			fc.assert(
				fc.property(fc.array(fc.anything()), xs =>
					expect(f(A.size(xs))(0)(xs)).toEqual(O.none),
				),
			)
		})

		it("moves source to target", () => {
			expect(f(0)(1)(["a", "b", "c"])).toEqual(O.some(["b", "a", "c"]))
			expect(f(1)(0)(["a", "b", "c"])).toEqual(O.some(["b", "a", "c"]))

			const n = 10

			fc.assert(
				fc.property(
					fc.array(fc.anything(), { minLength: n, maxLength: n }),
					fc.integer({ min: 0, max: n - 1 }),
					fc.integer({ min: 0, max: n - 1 }),
					(xs, i, j) => O.isSome(f(i)(j)(xs)),
				),
			)
		})

		it("returns the same array size", () => {
			const n = 10

			fc.assert(
				fc.property(
					fc.array(fc.anything(), { minLength: n, maxLength: n }),
					fc.integer({ min: 0, max: n - 1 }),
					fc.integer({ min: 0, max: n - 1 }),
					(xs, i, j) =>
						pipe(
							f(i)(j)(xs),
							O.exists(ys => A.size(ys) === n),
						),
				),
			)
		})

		it("sibling indices are interchangeable", () => {
			const n = 10

			fc.assert(
				fc.property(
					fc.array(fc.anything(), { minLength: n, maxLength: n }),
					fc.integer({ min: 0, max: n - 2 }),
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

		it("counts the same summed number as the A.size of the array", () => {
			// fast-check generates keys that fp-ts internals won't iterate over,
			// meaning without this the keys below won't necessarily add up.
			const filterSpecialKeys: Endomorphism<Array<string>> = A.chain(
				flow(k => R.singleton(k, null), R.keys),
			)

			fc.assert(
				fc.property(
					fc.array(fc.string()),
					xs =>
						pipe(xs, f(identity), values, sum) === filterSpecialKeys(xs).length,
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
						A.every(n => n > 0),
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

		it("supports subtyping", () => {
			type A = { n: number }
			type B = A & { x: string }
			const xs: Array<B> = []
			const _ys: Array<B> = f<A>(constTrue)(xs)
		})
	})

	describe("mean", () => {
		const f = mean

		it("calculates the mean", () => {
			expect(f([2, 7, 9])).toBe(6)

			fc.assert(
				fc.property(
					fc.integer({ min: 1, max: 50 }),
					fc.integer(),
					(x, y) => f(A.replicate(x, y) as NonEmptyArray<number>) === y,
				),
			)
		})
	})

	describe("median", () => {
		const f = median

		it("calculates the median", () => {
			expect(f([2, 9, 7])).toBe(7)
			expect(f([7, 2, 10, 9])).toBe(8)

			fc.assert(
				fc.property(
					fc.integer({ min: 1, max: 50 }),
					fc.integer(),
					(x, y) => f(A.replicate(x, y) as NonEmptyArray<number>) === y,
				),
			)
		})
	})

	describe("dropAt", () => {
		const f = dropAt
		const xs = ["a", "b", "c", "d", "e", "f", "g"]

		it("removes elements from index", () => {
			expect(f(2)(3)(xs)).toEqual(O.some(["a", "b", "f", "g"]))
		})

		it("removes everything from the index if count is too large", () => {
			expect(f(2)(Infinity)(xs)).toEqual(O.some(["a", "b"]))
		})

		it("rounds down both input numbers", () => {
			expect(f(1)(5)(xs)).toEqual(O.some(["a", "g"]))
			expect(f(1.9)(5.9)(xs)).toEqual(O.some(["a", "g"]))
		})

		it("returns None if index out of bounds", () => {
			expect(f(-1)(1)(xs)).toEqual(O.none)
			expect(f(xs.length)(1)(xs)).toEqual(O.none)
		})

		it("returns input array if count is not positive", () => {
			expect(f(2)(-1)(xs)).toEqual(O.some(xs))
			expect(f(2)(0)(xs)).toEqual(O.some(xs))
		})

		it("does not mutate input", () => {
			const ys = [1, 2, 3]
			expect(f(1)(1)(ys)).toEqual(O.some([1, 3]))
			expect(ys).toEqual([1, 2, 3])
		})
	})

	describe("transpose", () => {
		const f = transpose

		it("transposes equal A.size arrays", () => {
			expect(
				f([
					[1, 2, 3],
					[4, 5, 6],
				]),
			).toEqual([
				[1, 4],
				[2, 5],
				[3, 6],
			])

			expect(
				f([
					[1, 4],
					[2, 5],
					[3, 6],
				]),
			).toEqual([
				[1, 2, 3],
				[4, 5, 6],
			])
		})

		it("transposes unequal A.size arrays", () => {
			expect(f([[10, 11], [20], [], [30, 31, 32]])).toEqual([
				[10, 20, 30],
				[11, 31],
				[32],
			])
		})

		it("maintains same flattened size", () => {
			fc.assert(
				fc.property(
					fc.array(fc.array(fc.anything())),
					xs => A.size(A.flatten(xs)) === A.size(A.flatten(f(xs))),
				),
			)
		})

		it("does not mistakenly pass along undefined values", () => {
			fc.assert(
				fc.property(
					fc.array(fc.array(fc.anything().filter(x => x !== undefined))),
					flow(
						f,
						A.flatten,
						A.every(x => x !== undefined),
					),
				),
			)
		})
	})

	describe("takeRightWhile", () => {
		const f = takeRightWhile

		it("takes elements from the right until predicate fails", () => {
			expect(f<string>(x => x !== "c")(["a", "b", "c", "d", "e"])).toEqual([
				"d",
				"e",
			])
		})

		it("constTrue returns original array", () => {
			fc.assert(
				fc.property(fc.array(fc.anything()), xs =>
					expect(f(constTrue)(xs)).toEqual(xs),
				),
			)
		})

		it("constFalse returns empty array", () => {
			fc.assert(
				fc.property(fc.array(fc.anything()), xs =>
					expect(f(constFalse)(xs)).toEqual([]),
				),
			)
		})

		it("supports subtyping", () => {
			type A = { n: number }
			type B = A & { x: string }
			const xs: Array<B> = []
			const _ys: Array<B> = f<A>(constTrue)(xs)
		})
	})

	describe("symmetricDifference", () => {
		const f = symmetricDifference(N.Eq)

		it("returns unique values from both arrays", () => {
			expect(f([1, 2, 3, 4])([3, 4, 5, 6])).toEqual([1, 2, 5, 6])
			expect(f([1, 2, 3, 4, 3])([4, 3, 4, 5, 6])).toEqual([1, 2, 5, 6])
		})

		it("returns the items ordered by input array order", () => {
			expect(f([1, 7, 4, 3])([3, 4, 9, 6])).toEqual([1, 7, 9, 6])
		})

		it("keeps duplicates", () => {
			expect(f([1, 7, 7, 4, 3])([3, 4, 9, 6])).toEqual([1, 7, 7, 9, 6])
		})

		it("two empty inputs gives empty output", () => {
			expect(f([])([])).toEqual([])
		})

		it("one empty input returns other input whole", () => {
			fc.assert(
				fc.property(fc.array(fc.integer()), xs =>
					expect(f(xs)([])).toEqual(xs),
				),
			)

			fc.assert(
				fc.property(fc.array(fc.integer()), xs =>
					expect(f([])(xs)).toEqual(xs),
				),
			)
		})
	})

	describe("reduceWhile", () => {
		const f = reduceWhile

		it("reduces until predicate fails", () => {
			expect(f<number>(n => n !== 0)(add)(0)([1, 2, 0, 4, 5])).toBe(3)
		})

		it("reduces like normal with constTrue", () => {
			expect(f<number>(constTrue)(add)(0)([1, 2, 3, 4])).toBe(10)
		})

		it("returns initial value with constFalse", () => {
			expect(f<number>(constFalse)(add)(0)([1, 2, 3, 4])).toBe(0)
		})
	})

	describe("reduceRightWhile", () => {
		const f = reduceRightWhile

		it("reduces from the right until predicate fails", () => {
			expect(f<number>(n => n !== 0)(add)(0)([1, 2, 0, 4, 5])).toBe(9)
		})

		it("reduces like normal with constTrue", () => {
			expect(f<number>(constTrue)(add)(0)([1, 2, 3, 4])).toBe(10)
		})

		it("returns initial value with constFalse", () => {
			expect(f<number>(constFalse)(add)(0)([1, 2, 3, 4])).toBe(0)
		})
	})

	describe("minimum", () => {
		const f = minimum(N.Ord)

		it("returns identity on singleton non-empty array", () => {
			fc.assert(fc.property(fc.integer(), n => f([n]) === n))
		})

		it("returns the smallest value", () => {
			expect(f([3, 1, 2])).toBe(1)

			fc.assert(
				fc.property(
					fc.integer(),
					n => f([n, n + 1]) === n && f([n + 1, n]) === n,
				),
			)
		})
	})

	describe("maximum", () => {
		const f = maximum(N.Ord)

		it("returns identity on singleton non-empty array", () => {
			fc.assert(fc.property(fc.integer(), n => f([n]) === n))
		})

		it("returns the largest value", () => {
			expect(f([1, 3, 2])).toBe(3)

			fc.assert(
				fc.property(
					fc.integer(),
					n => f([n, n + 1]) === n + 1 && f([n + 1, n]) === n + 1,
				),
			)
		})
	})

	describe("zipAll", () => {
		const f = zipAll

		it("equal length inputs is equivalent to normal zip mapped to These", () => {
			fc.assert(
				fc.property(fc.array(fc.anything()), xs => {
					const ys = A.reverse(xs)
					expect(f(xs)(ys)).toEqual(
						pipe(
							A.zip(xs)(ys),
							A.map(([x, y]) => T.both(x, y)),
						),
					)
				}),
			)
		})

		it("extra items on second input are This", () => {
			const xs = [5, 6]
			const ys = [1, 2, 3, 4]

			expect(f(xs)(ys)).toEqual([
				T.both(1, 5),
				T.both(2, 6),
				T.left(3),
				T.left(4),
			])
		})

		it("extra items on first input are That", () => {
			const xs = [3, 4, 5, 6]
			const ys = [1, 2]

			expect(f(xs)(ys)).toEqual([
				T.both(1, 3),
				T.both(2, 4),
				T.right(5),
				T.right(6),
			])
		})

		it("output length is equal to largest input length", () => {
			fc.assert(
				fc.property(
					fc.array(fc.anything()),
					fc.array(fc.anything()),
					(xs, ys) => A.size(f(xs)(ys)) === max(N.Ord)(A.size(xs), A.size(ys)),
				),
			)
		})
	})

	describe("filterA", () => {
		const f = filterA(IO.Applicative)

		it("is identical to filter in an applicative context", () => {
			const g = A.filter
			const isEven: Predicate<number> = n => n % 2 === 0
			const isEvenIO = flow(isEven, IO.of)

			fc.assert(
				fc.property(fc.array(fc.integer()), xs =>
					expect(f(isEvenIO)(xs)()).toEqual(g(isEven)(xs)),
				),
			)
		})
	})

	describe("extractAt", () => {
		const f = extractAt(1)

		it("returns None on index out of bounds", () => {
			expect(f([])).toEqual(O.none)
			expect(f(["x"])).toEqual(O.none)
		})

		it("returns array of input size minus one", () => {
			fc.assert(
				fc.property(fc.array(fc.anything(), { minLength: 2 }), xs =>
					expect(pipe(xs, f, O.map(flow(snd, A.size)))).toEqual(
						pipe(xs, A.size, decrement, O.some),
					),
				),
			)
		})

		it("returns element at index", () => {
			fc.assert(
				fc.property(fc.array(fc.anything(), { minLength: 2 }), xs =>
					expect(pipe(xs, f, O.map(fst))).toEqual(A.lookup(1)(xs)),
				),
			)
		})

		it("does not mutate input", () => {
			const xs = [1, 2, 3]
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const _ = f(xs)
			expect(xs).toEqual([1, 2, 3])
		})
	})

	describe("fromIterable", () => {
		const f = fromIterable
		const iterableArb: fc.Arbitrary<Iterable<unknown>> = fc.oneof(
			fc.string(),
			fc.array(fc.anything()),
			fc.constant(new Set([42])),
			fc.constant(new Map([["foo", "bar"]])),
		)

		it('behaves identically to Array.from for Iterable input", () => {', () => {
			fc.assert(
				fc.property(iterableArb, x => expect(f(x)).toEqual(Array.from(x))),
			)
		})
	})

	describe("fromReadonly", () => {
		const f = fromReadonly

		it("copies the array contents", () => {
			fc.assert(
				fc.property(fc.array(fc.anything()), xs => expect(f(xs)).toEqual(xs)),
			)
		})

		it("does not reuse the input reference/object", () => {
			fc.assert(
				fc.property(fc.array(fc.anything()), xs => {
					const ys = f(xs)

					expect(xs).toBe(xs)
					expect(xs).not.toBe(ys)
				}),
			)
		})
	})

	describe("toReadonly", () => {
		const f = toReadonly

		it("copies the array contents", () => {
			fc.assert(
				fc.property(fc.array(fc.anything()), xs => expect(f(xs)).toEqual(xs)),
			)
		})

		it("does not reuse the input reference/object", () => {
			fc.assert(
				fc.property(fc.array(fc.anything()), xs => {
					const ys = f(xs)

					expect(xs).toBe(xs)
					expect(xs).not.toBe(ys)
				}),
			)
		})
	})

	describe("allM", () => {
		const f = allM(IO.Monad)

		it("returns conjunctive identity on empty input", () => {
			expect(f([])()).toBe(true)
		})

		it("equivalent to fold on lifted &&", () => {
			expect(f([IO.of(true), IO.of(true)])()).toBe(true && true)
			expect(f([IO.of(true), IO.of(false)])()).toBe(true && false)
			expect(f([IO.of(false), IO.of(true)])()).toBe(false && true)
			expect(f([IO.of(false), IO.of(false)])()).toBe(false && false)
		})

		/* eslint-disable functional/no-expression-statements */
		it("runs from the left and short-circuits", () => {
			let exe = false // eslint-disable-line functional/no-let
			const set: IO<boolean> = () => {
				exe = true
				return true
			}

			f([IO.of(true), IO.of(false), set, IO.of(true)])()
			expect(exe).toBe(false)

			f([IO.of(true), IO.of(true), set, IO.of(true)])()
			expect(exe).toBe(true)
		})
		/* eslint-enable functional/no-expression-statements */
	})

	describe("anyM", () => {
		const f = anyM(IO.Monad)

		it("returns disjunctive identity on empty input", () => {
			expect(f([])()).toBe(false)
		})

		it("equivalent to fold on lifted ||", () => {
			expect(f([IO.of(true), IO.of(true)])()).toBe(true || true)
			expect(f([IO.of(true), IO.of(false)])()).toBe(true || false)
			expect(f([IO.of(false), IO.of(true)])()).toBe(false || true)
			expect(f([IO.of(false), IO.of(false)])()).toBe(false || false)
		})

		/* eslint-disable functional/no-expression-statements */
		it("runs from the left and short-circuits", () => {
			let exe = false // eslint-disable-line functional/no-let
			const set: IO<boolean> = () => {
				exe = true
				return true
			}

			f([IO.of(false), IO.of(true), set, IO.of(false)])()
			expect(exe).toBe(false)

			f([IO.of(false), IO.of(false), set, IO.of(false)])()
			expect(exe).toBe(true)
		})
		/* eslint-enable functional/no-expression-statements */
	})

	describe("separateNE", () => {
		const f = separateNE

		it("returns These Left for only Either Lefts", () => {
			fc.assert(
				fc.property(fc.array(fc.anything(), { minLength: 1 }), xs => {
					const ys = pipe(xs as NonEmptyArray<unknown>, NEA.map(E.left))

					expect(f(ys)).toEqual(T.left(xs))
				}),
			)
		})

		it("returns These Right for only Either Rights", () => {
			fc.assert(
				fc.property(fc.array(fc.anything(), { minLength: 1 }), xs => {
					const ys = pipe(xs as NonEmptyArray<unknown>, NEA.map(E.right))

					expect(f(ys)).toEqual(T.right(xs))
				}),
			)
		})

		it("returns These Both for only mixed Eithers", () => {
			fc.assert(
				fc.property(
					fc.array(fc.anything(), { minLength: 1 }),
					fc.array(fc.anything(), { minLength: 1 }),
					(xs, ys) => {
						const zs = NEA.concat(
							pipe(
								xs as NonEmptyArray<unknown>,
								NEA.map(E.left<unknown, unknown>),
							),
						)(pipe(ys as NonEmptyArray<unknown>, NEA.map(E.right)))

						expect(f(zs)).toEqual(T.both(xs, ys))
						expect(f(NEA.reverse(zs))).toEqual(
							T.both(A.reverse(xs), A.reverse(ys)),
						)
					},
				),
			)
		})

		it("always returns a non-empty output", () => {
			fc.assert(
				fc.property(fc.array(fc.boolean(), { minLength: 1 }), xs => {
					const ys: NonEmptyArray<E.Either<boolean, boolean>> = pipe(
						xs as NonEmptyArray<boolean>,
						NEA.map(b => (b ? E.right(b) : E.left(b))),
					)

					const zs: NonEmptyArray<boolean> = pipe(
						ys,
						f,
						T.match(identity, identity, (ls, rs) => NEA.concat(ls)(rs)),
					)

					expect(A.size(zs)).toBeGreaterThan(0)
					expect(A.size(zs)).toBe(A.size(xs))
				}),
			)
		})

		it("equivaent to stricter separate", () => {
			const g = A.separate

			fc.assert(
				fc.property(fc.array(fc.boolean(), { minLength: 1 }), xs => {
					const ys: NonEmptyArray<E.Either<boolean, boolean>> = pipe(
						xs as NonEmptyArray<boolean>,
						NEA.map(b => (b ? E.right(b) : E.left(b))),
					)

					const nea: NonEmptyArray<boolean> = pipe(
						ys,
						f,
						T.match(identity, identity, (ls, rs) => NEA.concat(ls)(rs)),
					)

					const notNea: Array<boolean> = pipe(ys, g, ({ left, right }) =>
						A.concat(left)(right),
					)

					expect(nea).toEqual(notNea)
				}),
			)
		})
	})
})
