/* eslint-disable functional/no-expression-statements */

import fc from "fast-check"
import {
  sleep,
  elapsed,
  execute,
  when,
  unless,
  sequenceArray_,
  sequenceSeqArray_,
  traverseArray_,
  traverseSeqArray_,
} from "../src/Task"
import { constant, constVoid, identity, pipe } from "fp-ts/function"
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

  describe("sequenceArray_", () => {
    const f = sequenceArray_

    /* eslint-disable */
    it("sequences in parallel", async () => {
      let n = 0
      const g = pipe(
        sleep(mkMilliseconds(1)),
        T.chainFirstIOK(() => () => (n = n * 2)),
      )
      const h = pipe(
        T.fromIO(() => (n += 5)),
        T.map(constVoid),
      )

      await pipe(f([g, h]), execute)

      expect(n).toBe(10)
    })
    /* eslint-enable */
  })

  describe("sequenceSeqArray_", () => {
    const f = sequenceSeqArray_

    /* eslint-disable */
    it("sequences sequentially", async () => {
      let n = 0
      const g = pipe(
        sleep(mkMilliseconds(1)),
        T.chainFirstIOK(() => () => (n = n * 2)),
      )
      const h = pipe(
        T.fromIO(() => (n += 5)),
        T.map(constVoid),
      )

      await pipe(f([g, h]), execute)

      expect(n).toBe(5)
    })
    /* eslint-enable */
  })

  describe("traverseArray_", () => {
    const f = traverseArray_

    /* eslint-disable */
    it("traverses in parallel", async () => {
      let n = 0
      const g = pipe(
        sleep(mkMilliseconds(1)),
        T.chainFirstIOK(() => () => (n = n * 2)),
      )
      const h = pipe(
        T.fromIO(() => (n += 5)),
        T.map(constVoid),
      )

      await pipe(f(identity<T.Task<void>>)([g, h]), execute)

      expect(n).toBe(10)
    })
    /* eslint-enable */
  })

  describe("traverseSeqArray_", () => {
    const f = traverseSeqArray_

    /* eslint-disable */
    it("traverses sequentially", async () => {
      let n = 0
      const g = pipe(
        sleep(mkMilliseconds(1)),
        T.chainFirstIOK(() => () => (n = n * 2)),
      )
      const h = pipe(
        T.fromIO(() => (n += 5)),
        T.map(constVoid),
      )

      await pipe(f(identity<T.Task<void>>)([g, h]), execute)

      expect(n).toBe(5)
    })
    /* eslint-enable */
  })
})
