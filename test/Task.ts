import { describe, expect, it, jest } from "@jest/globals"
import fc from "fast-check"
import * as T from "fp-ts/Task"
import { constVoid, constant, identity, pipe } from "fp-ts/function"
import {
	elapsed,
	execute,
	pass,
	sequenceArray_,
	sequenceSeqArray_,
	sleep,
	traverseArray_,
	traverseSeqArray_,
	unless,
	until,
	when,
} from "../src/Task"
import Task = T.Task
import { mkMilliseconds, unMilliseconds } from "../src/Date"
import { add } from "../src/Number"

const flushPromises = (): Promise<void> =>
	new Promise(
		jest.requireActual<typeof import("timers")>("timers").setImmediate,
	)

describe("Task", () => {
	// Bun doesn't support fake timers yet.
	const desc = 'advanceTimersByTime' in jest ? describe : describe.skip;
	desc("sleep", () => {
		it("waits the specified period of time", async () => {
			jest.useFakeTimers()

			const spy = jest.fn()
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

		describe("when", () => {
			const f = when

			it("runs the effect on true condition", async () => {
				let ran = false
				const g = f(true)(async () => {
					ran = true
				})

				await g()
				return expect(ran).toBe(true)
			})

			it("does not run the effect on false condition", async () => {
				let ran = false
				const g = f(false)(async () => {
					ran = true
				})

				await g()
				return expect(ran).toBe(false)
			})

			it("does not prematurely execute side effect", async () => {
				let ran = false
				const g = f(true)(async () => {
					ran = true
				})

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

		describe("unless", () => {
			const f = unless

			it("runs the effect on false condition", async () => {
				let ran = false
				const g = f(false)(async () => {
					ran = true
				})

				await g()
				return expect(ran).toBe(true)
			})

			it("does not run the effect on true condition", async () => {
				let ran = false
				const g = f(true)(async () => {
					ran = true
				})

				await g()
				return expect(ran).toBe(false)
			})

			it("does not prematurely execute side effect", async () => {
				let ran = false
				const g = f(false)(async () => {
					ran = true
				})

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
	})

	describe("sequenceArray_", () => {
		const f = sequenceArray_

		it("sequences in parallel", async () => {
			let n = 0
			const g = pipe(
				sleep(mkMilliseconds(1)),
				T.chainFirstIOK(() => () => {
					n = n * 2
				}),
			)
			const h = pipe(
				T.fromIO(() => {
					n += 5
				}),
				T.map(constVoid),
			)

			await pipe(f([g, h]), execute)

			expect(n).toBe(10)
		})
	})

	describe("sequenceSeqArray_", () => {
		const f = sequenceSeqArray_

		it("sequences sequentially", async () => {
			let n = 0
			const g = pipe(
				sleep(mkMilliseconds(1)),
				T.chainFirstIOK(() => () => {
					n = n * 2
				}),
			)
			const h = pipe(
				T.fromIO(() => {
					n += 5
				}),
				T.map(constVoid),
			)

			await pipe(f([g, h]), execute)

			expect(n).toBe(5)
		})
	})

	describe("traverseArray_", () => {
		const f = traverseArray_

		it("traverses in parallel", async () => {
			let n = 0
			const g = pipe(
				sleep(mkMilliseconds(1)),
				T.chainFirstIOK(() => () => {
					n = n * 2
				}),
			)
			const h = pipe(
				T.fromIO(() => {
					n += 5
				}),
				T.map(constVoid),
			)

			await pipe(f(identity<T.Task<void>>)([g, h]), execute)

			expect(n).toBe(10)
		})
	})

	describe("traverseSeqArray_", () => {
		const f = traverseSeqArray_

		it("traverses sequentially", async () => {
			let n = 0
			const g = pipe(
				sleep(mkMilliseconds(1)),
				T.chainFirstIOK(() => () => {
					n = n * 2
				}),
			)
			const h = pipe(
				T.fromIO(() => {
					n += 5
				}),
				T.map(constVoid),
			)

			await pipe(f(identity<T.Task<void>>)([g, h]), execute)

			expect(n).toBe(5)
		})
	})

	describe("pass", () => {
		const f = pass

		it("is equivalent to of(undefined)", async () => {
			expect(await execute(f)).toBe(await execute(T.of(undefined)))
		})
	})

	describe("until", () => {
		const f = until<number>

		it("executes until predicate passes", async () => {
			let n = 0

			const g: Task<number> = () => Promise.resolve(++n)

			expect(await execute(f(n => n === 2)(g))).toBe(2)
			expect(n).toBe(2)

			expect(await execute(f(n => n === 6)(pipe(g, T.map(add(2)))))).toBe(6)
			expect(n).toBe(4)
		})
	})
})
