import * as IO from "fp-ts/IO"
import { constFalse, constTrue, identity, pipe } from "fp-ts/function"
import {
  once,
  whenInvocationCount,
  execute,
  when,
  unless,
  memoize,
  sequenceArray_,
  traverseArray_,
  pass,
  until,
} from "../src/IO.js"
import { add } from "../src/Number.js"
import fc from "fast-check"

type IO<A> = IO.IO<A>

describe("IO", () => {
  describe("once", () => {
    const f = once

    it("always returns the first input", () => {
      const g = f(add(5))

      expect(g(2)()).toBe(7)
      expect(g(3)()).toBe(7)
    })

    it("only calls function once", () => {
      let runs = 0 // eslint-disable-line functional/no-let
      const g = f<number, number>(n => {
        runs++ // eslint-disable-line functional/no-expression-statements
        return add(5)(n)
      })

      expect(runs).toBe(0)
      expect(g(2)()).toBe(7)
      expect(runs).toBe(1)
      expect(g(3)()).toBe(7)
      expect(runs).toBe(1)
      expect(g(2)()).toBe(7)
      expect(runs).toBe(1)
    })

    it("does not cross-pollute", () => {
      const g = f(add(5))
      const h = f(add(15))

      expect(g(2)()).toBe(7)
      expect(h(2)()).toBe(17)
      expect(g(3)()).toBe(7)
      expect(h(3)()).toBe(17)
    })
  })

  /* eslint-disable */
  describe("whenInvocationCount", () => {
    const f = whenInvocationCount

    it("always runs the effect on const true predicate", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 99 }), x => {
          let n = 0
          const g: IO<void> = () => {
            n++
          }
          const h = f(constTrue)(g)

          for (let i = 0; i < x; i++) h()
          return n === x
        }),
      )
    })

    it("never runs the effect on const false predicate", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 99 }), x => {
          let n = 0
          const g: IO<void> = () => {
            n++
          }
          const h = f(constFalse)(g)

          for (let i = 0; i < x; i++) h()
          return n === 0
        }),
      )
    })

    it("runs the effect whenever the predicate passes", () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 99 }), x => {
          let n = 0
          const g: IO<void> = () => {
            n++
          }
          const h = f(n => n % 2 === 0)(g)

          for (let i = 0; i < x; i++) h()
          return n === Math.floor(x / 2)
        }),
      )
    })
  })
  /* eslint-enable */

  describe("execute", () => {
    it("gets the value", () => {
      fc.assert(
        fc.property(fc.anything(), x =>
          expect(x).toEqual(pipe(x, IO.of, execute)),
        ),
      )
    })
  })

  /* eslint-disable */
  describe("when", () => {
    const f = when

    it("runs the effect on true condition", () => {
      let ran = false
      const g = f(true)(() => (ran = true))

      g()
      expect(ran).toBe(true)
    })

    it("does not run the effect on false condition", () => {
      let ran = false
      const g = f(false)(() => (ran = true))

      g()
      expect(ran).toBe(false)
    })

    it("does not prematurely execute side effect", () => {
      let ran = false
      const g = f(true)(() => (ran = true))

      expect(ran).toBe(false)
      const h = pipe(
        IO.of(123),
        IO.chainFirst(() => g),
      )
      expect(ran).toBe(false)
      h()
      expect(ran).toBe(true)
    })
  })
  /* eslint-enable */

  /* eslint-disable */
  describe("unless", () => {
    const f = unless

    it("runs the effect on false condition", () => {
      let ran = false
      const g = f(false)(() => (ran = true))

      g()
      expect(ran).toBe(true)
    })

    it("does not run the effect on true condition", () => {
      let ran = false
      const g = f(true)(() => (ran = true))

      g()
      expect(ran).toBe(false)
    })

    it("does not prematurely execute side effect", () => {
      let ran = false
      const g = f(false)(() => (ran = true))

      expect(ran).toBe(false)
      const h = pipe(
        IO.of(123),
        IO.chainFirst(() => g),
      )
      expect(ran).toBe(false)
      h()
      expect(ran).toBe(true)
    })
  })
  /* eslint-enable */

  /* eslint-disable */
  describe("memoize", () => {
    const f = memoize

    it("always returns the first result", () => {
      let i = 0
      const g = f(() => i++)

      expect(g()).toBe(g())
    })

    it("does not rerun the input function", () => {
      let i = 0
      const g = f(() => i++)

      g()
      g()
      g()

      expect(i).toBe(1)
    })
  })
  /* eslint-enable */

  describe("sequenceArray_", () => {
    const f = sequenceArray_

    /* eslint-disable */
    it("sequences from left to right", () => {
      let n = 0

      const g: IO<void> = () => (n += 5)
      const h: IO<void> = () => (n *= 2)

      pipe(f([g, h]), execute)

      expect(n).toBe(10)
    })
    /* eslint-enable */
  })

  describe("traverseArray_", () => {
    const f = traverseArray_

    /* eslint-disable */
    it("traverses from left to right", () => {
      let n = 0

      const g: IO<void> = () => (n += 5)
      const h: IO<void> = () => (n *= 2)

      pipe(f(identity<IO<void>>)([g, h]), execute)

      expect(n).toBe(10)
    })
    /* eslint-enable */
  })

  describe("pass", () => {
    const f = pass

    it("is equivalent to of(undefined)", () => {
      expect(execute(f)).toBe(execute(IO.of(undefined)))
    })
  })

  describe("until", () => {
    const f = until<number>

    it("executes until predicate passes", () => {
      // eslint-disable-next-line functional/no-let
      let n = 0

      const g: IO<number> = () => ++n

      expect(execute(f(n => n === 2)(g))).toBe(2)
      expect(n).toBe(2)

      expect(execute(f(n => n === 6)(pipe(g, IO.map(add(2)))))).toBe(6)
      expect(n).toBe(4)
    })
  })
})
