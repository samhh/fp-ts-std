/* eslint-disable functional/no-expression-statement */

import fc from "fast-check"
import { sleep, elapsed, execute, when, unless } from "../src/Task"
import { constant, constVoid, pipe } from "fp-ts/function"
import * as T from "fp-ts/Task"
import { mkMilliseconds, unMilliseconds } from "../src/Date"

const flushPromises = (): Promise<void> =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  new Promise(jest.requireActual("timers").setImmediate)

describe("Task", () => {
  describe("sleep", () => {
    it("waits the specified period of time", async () => {
      jest.useFakeTimers()

      const spy = jest.fn()
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      sleep(mkMilliseconds(1000))().then(spy)

      expect(spy).not.toHaveBeenCalled()

      jest.advanceTimersByTime(999)
      await flushPromises()

      expect(spy).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1)
      await flushPromises()

      expect(spy).toHaveBeenCalled()

      jest.useRealTimers()
    })
  })

  describe("elapsed", () => {
    const f = elapsed

    it("resolves the underlying task like usual", async () => {
      const x = "abc"

      const y = await pipe(T.of(x), T.delay(50), f(constant(constVoid)))()

      expect(x).toBe(y)
    })

    it("tracks the elapsed time via the callback", async () => {
      const x = "abc"

      // eslint-disable-next-line functional/no-let
      let time = 0

      await pipe(
        T.of(x),
        T.delay(50),
        f(n => () => {
          time = unMilliseconds(n)
        }),
      )()

      return time >= 50 && time < 60
    })

    describe("execute", () => {
      it("gets the value", () => {
        return fc.assert(
          fc.asyncProperty(fc.anything(), async x =>
            expect(x).toEqual(await pipe(x, T.of, execute)),
          ),
        )
      })
    })

    /* eslint-disable */
    describe("when", () => {
      const f = when

      it("runs the effect on true condition", async () => {
        let ran = false
        const g = f(true)(async () => void (ran = true))

        await g()
        return expect(ran).toBe(true)
      })

      it("does not run the effect on false condition", async () => {
        let ran = false
        const g = f(false)(async () => void (ran = true))

        await g()
        return expect(ran).toBe(false)
      })

      it("does not prematurely execute side effect", async () => {
        let ran = false
        const g = f(true)(async () => void (ran = true))

        expect(ran).toBe(false)
        const h = pipe(
          T.of(123),
          T.chainFirst(() => g),
        )
        expect(ran).toBe(false)
        await h()
        return expect(ran).toBe(true)
      })
    })
    /* eslint-enable */

    /* eslint-disable */
    describe("unless", () => {
      const f = unless

      it("runs the effect on false condition", async () => {
        let ran = false
        const g = f(false)(async () => void (ran = true))

        await g()
        return expect(ran).toBe(true)
      })

      it("does not run the effect on true condition", async () => {
        let ran = false
        const g = f(true)(async () => void (ran = true))

        await g()
        return expect(ran).toBe(false)
      })

      it("does not prematurely execute side effect", async () => {
        let ran = false
        const g = f(false)(async () => void (ran = true))

        expect(ran).toBe(false)
        const h = pipe(
          T.of(123),
          T.chainFirst(() => g),
        )
        expect(ran).toBe(false)
        await h()
        return expect(ran).toBe(true)
      })
    })
    /* eslint-enable */
  })
})
