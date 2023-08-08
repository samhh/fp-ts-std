import { describe, it, expect } from "@jest/globals"
import * as F from "../src/Function"
import {
  withIndex,
  unary,
  guard,
  ifElse,
  unless,
  when,
  until,
  construct,
  invoke,
  invokeNullary,
  invokeOn,
  memoize,
  curry2,
  curry2T,
  curry3,
  curry3T,
  curry4,
  curry4T,
  curry5,
  curry5T,
  uncurry2,
  uncurry3,
  uncurry4,
  uncurry5,
  fork,
  converge,
  isInstanceOf,
  applyEvery,
  applySomes,
  applyN,
} from "../src/Function"
import * as Fn from "../src/Function"
import { fromNumber } from "../src/String"
import { Option } from "fp-ts/Option"
import * as O from "fp-ts/Option"
import * as A from "fp-ts/Array"
import { add, multiply } from "../src/Number"
import {
  apply,
  constant,
  constFalse,
  constTrue,
  flip,
  flow,
  identity,
  increment,
  pipe,
} from "fp-ts/function"
import { Endomorphism } from "fp-ts/Endomorphism"
import * as N from "fp-ts/number"
import fc from "fast-check"
import * as S from "../src/String"
import { join } from "../src/Array"
import * as laws from "fp-ts-laws"
import * as Eq from "fp-ts/Eq"
type Eq<A> = Eq.Eq<A>
import { sequenceS } from "fp-ts/Apply"

const getArb: <A>(x: fc.Arbitrary<A>) => fc.Arbitrary<<B>(x: B) => A> = x =>
  x.map(constant)

const getEq: <A>(x: Eq<A>) => Eq<<B>(x: B) => A> = Eq.contramap(apply("foo"))

describe("Function", () => {
  describe("Functor", () => {
    // fmap id = id
    describe("is lawful", () => {
      laws.functor(F.Functor)(getArb, getEq)

      it("identity", () => {
        fc.assert(
          fc.property(fc.anything(), fc.anything(), (x, y) => {
            const left = pipe(F.of(x), F.map(identity), apply(y))
            const right = pipe(F.of(x), identity, apply(y))

            expect(left).toEqual(right)
          }),
        )
      })

      // fmap (g . f) == fmap g . fmap f
      it("composition", () => {
        fc.assert(
          fc.property(
            fc.integer(),
            fc.integer(),
            fc.integer(),
            fc.anything(),
            (x, y, z, zz) => {
              const f = add(y)
              const g = multiply(z)

              const left = pipe(F.of(x), F.map(flow(f, g)), apply(zz))
              const right = pipe(F.of(x), F.map(f), F.map(g), apply(zz))

              return expect(left).toEqual(right)
            },
          ),
        )
      })
    })
  })

  describe("Applicative", () => {
    laws.applicative(F.Applicative)(getArb, getEq)

    describe("is lawful", () => {
      // pure id <*> x = x
      it("identity", () => {
        fc.assert(
          fc.property(fc.anything(), fc.anything(), (x, y) => {
            const left = pipe(F.of(identity), F.ap(F.of(x)), apply(y))
            const right = pipe(F.of(x), apply(y))

            return expect(left).toEqual(right)
          }),
        )
      })

      // pure f <*> pure x = pure (f x)
      it("homomorphism", () => {
        fc.assert(
          fc.property(fc.integer(), fc.integer(), fc.anything(), (x, y, z) => {
            const f = add(y)

            const left = pipe(F.of(f), F.ap(F.of(x)), apply(z))
            const right = pipe(F.of(f(x)), apply(z))

            return expect(left).toEqual(right)
          }),
        )
      })

      // x <*> pure y = pure ($ y) <*> x
      it("interchange", () => {
        fc.assert(
          fc.property(fc.integer(), fc.integer(), fc.anything(), (x, y, z) => {
            const f = add(y)

            const left = pipe(F.of(f), F.ap(F.of(x)), apply(z))
            const right = pipe(F.of(apply(x)), F.ap(F.of(f)), apply(z))

            return expect(left).toEqual(right)
          }),
        )
      })

      // pure (.) <*> x <*> y <*> y = x <*> (y <*> y)
      it("composition", () => {
        fc.assert(
          fc.property(
            fc.integer(),
            fc.integer(),
            fc.integer(),
            fc.anything(),
            (x, y, z, zz) => {
              const f = add(y)
              const g = multiply(z)

              const compose: <B, C>(
                bc: (x: B) => C,
              ) => <A>(ab: (x: A) => B) => (x: A) => C = bc => ab =>
                flow(ab, bc)

              // The type system struggles to follow polymorphic compose below, so we'll fix the
              // types here.
              const composeMono: (
                bc: Endomorphism<number>,
              ) => (ab: Endomorphism<number>) => Endomorphism<number> = compose

              const left = pipe(
                F.of(composeMono),
                F.ap(F.of(f)),
                F.ap(F.of(g)),
                F.ap(F.of(x)),
                apply(zz),
              )
              const right = pipe(
                F.of(f),
                F.ap(pipe(F.of(g), F.ap(F.of(x)))),
                apply(zz),
              )

              return expect(left).toEqual(right)
            },
          ),
        )
      })
    })

    it("works with sequencing utilities", () => {
      const f = sequenceS(F.Applicative)({
        x: S.fromNumber,
        y: flow(add(2), S.fromNumber),
      })

      expect(f(5)).toEqual({ x: "5", y: "7" })
    })
  })

  describe("Monad", () => {
    laws.monad(F.Monad)(getEq)

    describe("is lawful", () => {
      // return x >>= f = f x
      it("left identity", () => {
        fc.assert(
          fc.property(fc.integer(), fc.integer(), fc.anything(), (x, y, z) => {
            const f = flow(add(y), F.of)

            const left = pipe(F.of(x), F.chain(f), apply(z))
            const right = pipe(f(x), apply(z))

            return expect(left).toEqual(right)
          }),
        )
      })

      // x >>= return = x
      it("right identity", () => {
        fc.assert(
          fc.property(fc.anything(), fc.anything(), (x, y) => {
            const left = pipe(F.of(x), F.chain(F.of), apply(y))
            const right = pipe(F.of(x), apply(y))

            return expect(left).toEqual(right)
          }),
        )
      })

      // (x >>= f) >>= g = x >>= (\y -> f y >>= g)
      it("associativity", () => {
        fc.assert(
          fc.property(
            fc.integer(),
            fc.integer(),
            fc.integer(),
            fc.anything(),
            (x, y, z, zz) => {
              const f = flow(add(y), F.of)
              const g = flow(multiply(z), F.of)

              const left = pipe(F.of(x), F.chain(f), F.chain(g), apply(zz))
              const right = pipe(
                F.of(x),
                F.chain(flow(f, F.chain(g))),
                apply(zz),
              )

              return expect(left).toEqual(right)
            },
          ),
        )
      })
    })

    it("supports do notation", () => {
      const f = pipe(
        Fn.Do,
        Fn.apS("x", fromNumber),
        Fn.apS("y", flow(add(2), fromNumber)),
        Fn.map(({ x, y }) => x + y),
      )

      expect(f(123)).toBe("123125")
    })
  })

  describe("withIndex", () => {
    const f = withIndex<number, number, number>(A.map)
    const g = withIndex<number, boolean, number>(A.filter)
    const h = withIndex<number, Option<number>, number>(A.filterMap)

    it("supplies an iterating index starting at zero", () => {
      expect(f(i => () => i)([1, 2, 3])).toEqual([0, 1, 2])
      expect(f(add)([1, 2, 3])).toEqual([1, 3, 5])
      expect(g(i => () => i % 2 === 0)([1, 2, 3])).toEqual([1, 3])
      expect(h(i => x => i % 2 === 0 ? O.some(x) : O.none)([1, 2, 3])).toEqual([
        1, 3,
      ])
    })
  })

  describe("unary", () => {
    const f = unary(Math.max)

    it("spreads the array input over the function", () => {
      const xs = [1, 3, 2]

      // @ts-expect-error ensure it doesn't work without our unary helper
      expect(Math.max(xs)).toBeNaN()
      expect(f(xs)).toBe(3)
    })
  })

  describe("guard", () => {
    const f = guard

    it("returns fallback if all predicates fail", () => {
      expect(f<number, string>([])(constant("fallback"))(123)).toBe("fallback")

      expect(
        f<number, string>([
          [constFalse, constant("x")],
          [constFalse, constant("y")],
          [constFalse, constant("z")],
        ])(fromNumber)(123),
      ).toBe("123")
    })

    it("returns the morphism output from the first successful predicate", () => {
      expect(
        f<number, string>([
          [n => n === 122, constant("x")],
          [n => n === 123, constant("y")],
          [n => n === 123, constant("z")],
        ])(constant("fallback"))(123),
      ).toBe("y")
    })
  })

  describe("ifElse", () => {
    const f = ifElse
    const g = f(constant(1))(constant(2))

    it("applies first function if predicate succeeds", () => {
      expect(g(constTrue)(null)).toBe(1)
    })

    it("applies second function if predicate fails", () => {
      expect(g(constFalse)(null)).toBe(2)
    })
  })

  describe("unless", () => {
    const f = flip(unless)(multiply(2))

    it("returns identity on input if predicate succeeds", () => {
      expect(f(constTrue)(5)).toBe(5)
    })

    it("applies function to input if predicate fails", () => {
      expect(f(constFalse)(5)).toBe(10)
    })
  })

  describe("when", () => {
    const f = flip(when)(multiply(2))

    it("applies function to input if predicate succeeds", () => {
      expect(f(constTrue)(5)).toBe(10)
    })

    it("returns identity on input if predicate fails", () => {
      expect(f(constFalse)(5)).toBe(5)
    })
  })

  describe("until", () => {
    const f = until<number>(n => n > 5)(n => n * 2)

    it("never applies function if predicate already holds", () => {
      expect(f(7)).toBe(7)
    })

    it("applies function until predicate holds", () => {
      expect(f(1)).toBe(8)
    })
  })

  describe("construct", () => {
    const f = construct

    // eslint-disable-next-line functional/no-classes
    class X {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      constructor(public x: number, public y: string) {}
    }

    it("instantiates and passes on constructor arguments", () => {
      const xs: [number, string] = [123, "xyz"]

      expect(f(X)(xs)).toEqual(new X(...xs))
      expect(f(X)(xs).x).toBe(123)
      expect(f(X)(xs).y).toBe("xyz")
    })
  })

  describe("invoke", () => {
    const f = invoke

    it("calls the method with arguments on the object", () => {
      // eslint-disable-next-line functional/no-classes
      class X {
        static f(x: string) {
          return x + x
        }
      }

      expect(f("f")(["xyz"])(X)).toBe("xyzxyz")
      expect(f("padStart")([8, "."])("hello")).toBe("...hello")
    })
  })

  describe("invokeNullary", () => {
    const f = invokeNullary

    it("calls the method", () => {
      // eslint-disable-next-line functional/no-classes
      class X {
        static f() {
          return 42
        }
      }

      expect(f("f")(X)).toBe(42)
      expect(f("trim")(" hello ")).toBe("hello")
    })
  })

  describe("invokeOn", () => {
    const f = invokeOn

    it("calls the method with arguments on the object", () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 5, maxLength: 5 }),
          x => f<string>()("padStart")([8, "."])(x) === "..." + x,
        ),
      )
    })
  })

  describe("memoize", () => {
    const f = memoize

    it("always returns the same output provided same input", () => {
      const g = f(N.Eq)(add(5))

      expect(g(2)).toBe(7)
      expect(g(3)).toBe(8)
      expect(g(2)).toBe(7)

      fc.assert(fc.property(fc.integer(), n => g(n) === n + 5))
    })

    it("does not call function more than once per input", () => {
      let runs = 0 // eslint-disable-line functional/no-let
      const g = f(N.Eq)<number>(n => {
        runs++ // eslint-disable-line functional/no-expression-statements
        return add(5)(n)
      })

      expect(runs).toBe(0)
      expect(g(2)).toBe(7)
      expect(runs).toBe(1)
      expect(g(3)).toBe(8)
      expect(runs).toBe(2)
      expect(g(2)).toBe(7)
      expect(runs).toBe(2)
    })

    it("does not cross-pollute", () => {
      const g = f(N.Eq)(add(5))
      const h = f(N.Eq)(add(15))

      expect(g(2)).toBe(7)
      expect(h(2)).toBe(17)
      expect(g(3)).toBe(8)
      expect(h(3)).toBe(18)
      expect(g(2)).toBe(7)
      expect(h(2)).toBe(17)
    })
  })

  describe("curry2", () => {
    const f = curry2
    const g = (a: string, b: string): string => a + b

    it("applies the function with the arguments in the same order", () => {
      expect(f(g)("a")("b")).toBe(g("a", "b"))
    })
  })

  describe("curry2T", () => {
    const f = curry2T
    const g = ([a, b]: [string, string]): string => a + b

    it("applies the function with the arguments in the same order", () => {
      expect(f(g)("a")("b")).toBe(g(["a", "b"]))
    })
  })

  describe("curry3", () => {
    const f = curry3
    const g = (a: string, b: string, c: string): string => a + b + c

    it("applies the function with the arguments in the same order", () => {
      expect(f(g)("a")("b")("c")).toBe(g("a", "b", "c"))
    })
  })

  describe("curry3T", () => {
    const f = curry3T
    const g = ([a, b, c]: [string, string, string]): string => a + b + c

    it("applies the function with the arguments in the same order", () => {
      expect(f(g)("a")("b")("c")).toBe(g(["a", "b", "c"]))
    })
  })

  describe("curry4", () => {
    const f = curry4
    const g = (a: string, b: string, c: string, d: string): string =>
      a + b + c + d

    it("applies the function with the arguments in the same order", () => {
      expect(f(g)("a")("b")("c")("d")).toBe(g("a", "b", "c", "d"))
    })
  })

  describe("curry4T", () => {
    const f = curry4T
    const g = ([a, b, c, d]: [string, string, string, string]): string =>
      a + b + c + d

    it("applies the function with the arguments in the same order", () => {
      expect(f(g)("a")("b")("c")("d")).toBe(g(["a", "b", "c", "d"]))
    })
  })

  describe("curry5", () => {
    const f = curry5
    const g = (a: string, b: string, c: string, d: string, e: string): string =>
      a + b + c + d + e

    it("applies the function with the arguments in the same order", () => {
      expect(f(g)("a")("b")("c")("d")("e")).toBe(g("a", "b", "c", "d", "e"))
    })
  })

  describe("curry5T", () => {
    const f = curry5T
    const g = ([a, b, c, d, e]: [
      string,
      string,
      string,
      string,
      string,
    ]): string => a + b + c + d + e

    it("applies the function with the arguments in the same order", () => {
      expect(f(g)("a")("b")("c")("d")("e")).toBe(g(["a", "b", "c", "d", "e"]))
    })
  })

  describe("uncurry2", () => {
    const f = uncurry2
    const g =
      (a: string): Endomorphism<string> =>
      b =>
        a + b

    it("applies the function with the arguments in the same order", () => {
      expect(f(g)(["a", "b"])).toBe(g("a")("b"))
    })
  })

  describe("uncurry3", () => {
    const f = uncurry3
    const g =
      (a: string) =>
      (b: string): Endomorphism<string> =>
      c =>
        a + b + c

    it("applies the function with the arguments in the same order", () => {
      expect(f(g)(["a", "b", "c"])).toBe(g("a")("b")("c"))
    })
  })

  describe("uncurry4", () => {
    const f = uncurry4
    const g =
      (a: string) =>
      (b: string) =>
      (c: string): Endomorphism<string> =>
      d =>
        a + b + c + d

    it("applies the function with the arguments in the same order", () => {
      expect(f(g)(["a", "b", "c", "d"])).toBe(g("a")("b")("c")("d"))
    })
  })

  describe("uncurry5", () => {
    const f = uncurry5
    const g =
      (a: string) =>
      (b: string) =>
      (c: string) =>
      (d: string): Endomorphism<string> =>
      e =>
        a + b + c + d + e

    it("applies the function with the arguments in the same order", () => {
      expect(f(g)(["a", "b", "c", "d", "e"])).toBe(g("a")("b")("c")("d")("e"))
    })
  })

  describe("fork", () => {
    const f = fork

    it("calls all provided functions and returns their outputs in order", () => {
      fc.assert(
        fc.property(fc.string(), x =>
          expect(
            fork([
              S.append("!"),
              identity,
              S.append("?"),
              A.of,
              S.prepend("."),
            ])(x),
          ).toEqual([x + "!", x, x + "?", [x], "." + x]),
        ),
      )
      expect(f)
    })
  })

  describe("converge", () => {
    const f = converge

    it("returns lifted identity on identity converging function and lifted identity tuple", () => {
      fc.assert(
        fc.property(fc.anything(), x =>
          expect(f(identity)([identity])(x)).toEqual([x]),
        ),
      )
    })

    it("calls all provided functions and outputs the resulting tuple to the converging function", () => {
      fc.assert(
        fc.property(
          fc.string(),
          x =>
            f(join(" "))([S.append("!"), identity, S.prepend("?")])(x) ===
            `${x}! ${x} ?${x}`,
        ),
      )
    })
  })

  describe("isInstanceOf", () => {
    it("is equivalent to instanceof operator", () => {
      // eslint-disable-next-line functional/no-classes
      class X {}
      const x = new X()

      expect(isInstanceOf(X)(x)).toBe(true)
      expect(isInstanceOf(Object)(x)).toBe(true)
      expect(isInstanceOf(Function)(x)).toBe(false)
      expect(isInstanceOf(String)("abcd")).toBe(false)
    })
  })

  describe("applyEvery", () => {
    const f = applyEvery

    it("returns identity on empty array", () => {
      fc.assert(fc.property(fc.anything(), x => expect(f([])(x)).toEqual(x)))
    })

    it("applies functions from left side", () => {
      const fs: Array<Endomorphism<number>> = [increment, multiply(3)]
      expect(f(fs)(1)).not.toBe(4)
      expect(f(fs)(1)).toBe(6)
    })
  })

  describe("applySomes", () => {
    const f = applySomes

    it("returns identity on empty array", () => {
      fc.assert(fc.property(fc.anything(), x => expect(f([])(x)).toEqual(x)))
    })

    it("returns identity on array of None", () => {
      fc.assert(
        fc.property(fc.anything(), fc.array(fc.constant(O.none)), (x, gs) =>
          expect(f(gs)(x)).toEqual(x),
        ),
      )
    })

    it("applies functions from left side if Some", () => {
      const fs: Array<Option<Endomorphism<number>>> = [
        O.some(increment),
        O.none,
        O.some(multiply(3)),
      ]
      expect(f(fs)(1)).not.toBe(4)
      expect(f(fs)(1)).toBe(6)
    })
  })

  describe("applyN", () => {
    const f: Endomorphism<number> = n => applyN(n)(increment)(2)

    it("applies the function the specified number of times", () => {
      expect(f(3)).toBe(5)

      fc.assert(
        fc.property(fc.integer({ min: 1, max: 50 }), n => f(n) === n + 2),
      )
    })

    it("returns identity on non-positive number", () => {
      expect(f(0)).toBe(2)
      expect(f(-1)).toBe(2)
    })
  })
})
