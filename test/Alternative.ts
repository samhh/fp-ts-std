import fc from "fast-check"
import { pureIf, altAllBy } from "../src/Alternative"
import * as O from "fp-ts/Option"
import { constant } from "fp-ts/function"
import { Lazy } from "../src/Lazy"

describe("Alternative", () => {
  describe("pureIf", () => {
    const f = pureIf(O.Alternative)

    it("returns constant empty/zero on false", () => {
      fc.assert(
        fc.property(fc.anything(), x =>
          expect(f(false)(constant(x))).toEqual(O.none),
        ),
      )
    })

    it("returns lifted input on true", () => {
      fc.assert(
        fc.property(fc.anything(), x =>
          expect(f(true)(constant(x))).toEqual(O.some(x)),
        ),
      )
    })

    /* eslint-disable functional/no-expression-statements */
    it("lazily evaluates value", () => {
      let exe = false // eslint-disable-line functional/no-let
      const g: Lazy<void> = () => {
        exe = true
      }

      f(false)(g)
      expect(exe).toBe(false)

      f(true)(g)
      expect(exe).toBe(true)
    })
    /* eslint-enable functional/no-expression-statements */
  })

  describe("altAllBy", () => {
    const f = altAllBy(O.Alternative)

    it("returns constant empty on empty input", () => {
      fc.assert(
        fc.property(fc.anything(), x =>
          expect(f([])(constant(x))).toEqual(O.none),
        ),
      )
    })

    it("returns constant empty on all-empty input", () => {
      fc.assert(
        fc.property(fc.anything(), x =>
          expect(
            f([constant(O.none), constant(O.none), constant(O.none)])(
              constant(x),
            ),
          ).toEqual(O.none),
        ),
      )
    })

    it("returns left-most non-empty value", () => {
      fc.assert(
        fc.property(fc.anything(), fc.anything(), fc.anything(), (x, y, z) =>
          expect(
            f([constant(O.none), constant(O.some(x)), constant(O.some(y))])(
              constant(z),
            ),
          ).toEqual(O.some(x)),
        ),
      )
    })

    /* eslint-disable functional/no-expression-statements */
    it("short-circuits", () => {
      let exe = false // eslint-disable-line functional/no-let
      const g: Lazy<O.Option<string>> = () => {
        exe = true
        return O.some("bar")
      }

      expect(f([constant(O.some("foo")), g])("baz")).toEqual(O.some("foo"))
      expect(exe).toBe(false)

      expect(f([g, constant(O.some("foo"))])("baz")).toEqual(O.some("bar"))
      expect(exe).toBe(true)
    })
    /* eslint-enable functional/no-expression-statements */
  })
})
