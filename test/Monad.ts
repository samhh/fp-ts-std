/* eslint-disable functional/no-expression-statement */

import * as IO from "fp-ts/IO"
import { constant, constVoid, flip } from "fp-ts/function"
import {
  ifM,
  andM,
  orM,
  allPassM,
  anyPassM,
  nonePassM,
  whenM,
} from "../src/Monad"
import { when } from "../src/Applicative"
import { allPass, anyPass, nonePass } from "../src/Predicate"

type IO<A> = IO.IO<A>

describe("Monad", () => {
  describe("ifM", () => {
    const f = ifM(IO.Monad)

    it("returns action according to condition", () => {
      let x = "baz" // eslint-disable-line functional/no-let
      const g =
        (y: string): IO<void> =>
        () => {
          x = y
        }

      f(IO.of(true))(g("foo"))(g("bar"))()
      expect(x).toBe("foo")

      f(IO.of(false))(g("foo"))(g("bar"))()
      expect(x).toBe("bar")
    })

    it("does not execute the non-returned condition", () => {
      let exe = false // eslint-disable-line functional/no-let
      const set: IO<void> = () => {
        exe = true
      }

      f(IO.of(true))(constVoid)(set)()
      expect(exe).toBe(false)

      f(IO.of(false))(set)(constVoid)()
      expect(exe).toBe(false)
    })
  })

  describe("andM", () => {
    const f = andM(IO.Monad)

    it("equivalent to lifted &&", () => {
      expect(f(IO.of(true))(IO.of(true))()).toBe(true && true)
      expect(f(IO.of(true))(IO.of(false))()).toBe(true && false)
      expect(f(IO.of(false))(IO.of(true))()).toBe(false && true)
      expect(f(IO.of(false))(IO.of(false))()).toBe(false && false)
    })

    it("short-circuits", () => {
      let exe = false // eslint-disable-line functional/no-let
      const set: IO<boolean> = () => {
        exe = true
        return true
      }

      f(IO.of(false))(set)()
      expect(exe).toBe(false)

      f(IO.of(true))(set)()
      expect(exe).toBe(true)
    })
  })

  describe("orM", () => {
    const f = orM(IO.Monad)

    it("equivalent to lifted ||", () => {
      expect(f(IO.of(true))(IO.of(true))()).toBe(true || true)
      expect(f(IO.of(true))(IO.of(false))()).toBe(true || false)
      expect(f(IO.of(false))(IO.of(true))()).toBe(false || true)
      expect(f(IO.of(false))(IO.of(false))()).toBe(false || false)
    })

    it("short-circuits", () => {
      let exe = false // eslint-disable-line functional/no-let
      const set: IO<boolean> = () => {
        exe = true
        return true
      }

      f(IO.of(true))(set)()
      expect(exe).toBe(false)

      f(IO.of(false))(set)()
      expect(exe).toBe(true)
    })
  })

  describe("allPassM", () => {
    const f = allPassM(IO.Monad)

    it("equivalent to lifted allPass", () => {
      const g = flip(f)("foo")
      const h = flip(allPass)("foo")

      expect(g([constant(IO.of(true)), constant(IO.of(true))])()).toBe(
        h([constant(true), constant(true)]),
      )
      expect(g([constant(IO.of(true)), constant(IO.of(false))])()).toBe(
        h([constant(true), constant(false)]),
      )
      expect(g([constant(IO.of(false)), constant(IO.of(true))])()).toBe(
        h([constant(false), constant(true)]),
      )
      expect(g([constant(IO.of(false)), constant(IO.of(false))])()).toBe(
        h([constant(false), constant(false)]),
      )
    })

    it("short-circuits, including the predicate", () => {
      let exe = false // eslint-disable-line functional/no-let

      const set = (): IO<boolean> => {
        exe = true
        return () => {
          exe = true
          return false
        }
      }

      f([constant(IO.of(false)), set])("foo")()
      expect(exe).toBe(false)

      f([set, constant(IO.of(false))])("foo")()
      expect(exe).toBe(true)
    })
  })

  describe("anyPassM", () => {
    const f = anyPassM(IO.Monad)

    it("equivalent to lifted anyPass", () => {
      const g = flip(f)("foo")
      const h = flip(anyPass)("foo")

      expect(g([constant(IO.of(true)), constant(IO.of(true))])()).toBe(
        h([constant(true), constant(true)]),
      )
      expect(g([constant(IO.of(true)), constant(IO.of(false))])()).toBe(
        h([constant(true), constant(false)]),
      )
      expect(g([constant(IO.of(false)), constant(IO.of(true))])()).toBe(
        h([constant(false), constant(true)]),
      )
      expect(g([constant(IO.of(false)), constant(IO.of(false))])()).toBe(
        h([constant(false), constant(false)]),
      )
    })

    it("short-circuits, including the predicate", () => {
      let exe = false // eslint-disable-line functional/no-let

      const set = (): IO<boolean> => {
        exe = true
        return () => {
          exe = true
          return false
        }
      }

      f([constant(IO.of(true)), set])("foo")()
      expect(exe).toBe(false)

      f([set, constant(IO.of(true))])("foo")()
      expect(exe).toBe(true)
    })
  })

  describe("nonePassM", () => {
    const f = nonePassM(IO.Monad)

    it("equivalent to lifted nonePass", () => {
      const g = flip(f)("foo")
      const h = flip(nonePass)("foo")

      expect(g([constant(IO.of(true)), constant(IO.of(true))])()).toBe(
        h([constant(true), constant(true)]),
      )
      expect(g([constant(IO.of(true)), constant(IO.of(false))])()).toBe(
        h([constant(true), constant(false)]),
      )
      expect(g([constant(IO.of(false)), constant(IO.of(true))])()).toBe(
        h([constant(false), constant(true)]),
      )
      expect(g([constant(IO.of(false)), constant(IO.of(false))])()).toBe(
        h([constant(false), constant(false)]),
      )
    })

    it("short-circuits, including the predicate", () => {
      let exe = false // eslint-disable-line functional/no-let

      const set = (): IO<boolean> => {
        exe = true
        return () => {
          exe = true
          return false
        }
      }

      f([constant(IO.of(true)), set])("foo")()
      expect(exe).toBe(false)

      f([set, constant(IO.of(true))])("foo")()
      expect(exe).toBe(true)
    })
  })

  describe("whenM", () => {
    const f = whenM(IO.Monad)

    it("doesn't execute action if condition fails", () => {
      let exe = false // eslint-disable-line functional/no-let

      const set: IO<boolean> = () => (exe = true)

      expect(exe).toBe(false)

      f(IO.of(false))(set)()
      expect(exe).toBe(false)

      f(IO.of(true))(set)()
      expect(exe).toBe(true)
    })

    it("equivalent to lifted applicative when", () => {
      // eslint-disable-next-line functional/no-let
      let n = 0

      const inc: IO<void> = () => n++
      const g = flip(f)(inc)
      const h = flip(when(IO.Applicative))(inc)

      expect(n).toBe(0)

      g(IO.of(true))()
      h(true)()
      expect(n).toBe(2)

      g(IO.of(false))()
      h(false)()
      expect(n).toBe(2)

      g(IO.of(true))()
      h(true)()
      expect(n).toBe(4)
    })
  })
})
