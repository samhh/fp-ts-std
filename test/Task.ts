/* eslint-disable functional/no-expression-statement */

import { sleep, elapsed } from "../src/Task"
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
  })
})
