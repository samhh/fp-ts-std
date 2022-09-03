import {
  NonEmptyString,
  unNonEmptyString,
  unsafeFromString,
  Eq,
  Ord,
  Semigroup,
  fromNumber,
  append,
  prepend,
  surround,
  toUpperCase,
  toLowerCase,
  reverse,
  head,
  last,
} from "../src/NonEmptyString"
import {
  isEmpty as _isEmpty,
  toUpperCase as _toUpperCase,
  toLowerCase as _toLowerCase,
} from "fp-ts/string"
import * as laws from "fp-ts-laws"
import fc from "fast-check"
import * as Str from "../src/String"
import { flow, pipe } from "fp-ts/function"
import { not, Predicate } from "fp-ts/Predicate"
import * as Pred from "fp-ts/Predicate"
import { unsafeUnwrap } from "../src/Option"

const arb = fc.string({ minLength: 1 }).map(unsafeFromString)

const isValid: Predicate<NonEmptyString> = Pred.contramap(unNonEmptyString)(
  not(_isEmpty),
)

describe("NonEmptyString", () => {
  describe("Eq", () => {
    it("is lawful", () => {
      laws.eq(Eq, arb)
    })
  })

  describe("Ord", () => {
    it("is lawful", () => {
      laws.ord(Ord, arb)
    })
  })

  describe("Semigroup", () => {
    it("is lawful", () => {
      laws.semigroup(Semigroup, Eq, arb)
    })
  })

  describe("fromNumber", () => {
    const f = fromNumber

    it("is equivalent to lifted Str.fromNumber", () => {
      fc.assert(
        fc.property(
          fc.integer(),
          n => Str.fromNumber(n) === unNonEmptyString(f(n)),
        ),
      )
    })

    it("maintains newtype contract", () => {
      fc.assert(fc.property(fc.integer(), flow(f, isValid)))
    })
  })

  describe("append", () => {
    const f = append

    it("is equivalent to lifted Str.append", () => {
      fc.assert(
        fc.property(
          fc.string(),
          arb,
          (x, y) =>
            Str.append(x)(unNonEmptyString(y)) === unNonEmptyString(f(x)(y)),
        ),
      )
    })

    it("maintains newtype contract", () => {
      fc.assert(fc.property(fc.string(), arb, (x, y) => pipe(y, f(x), isValid)))
    })
  })

  describe("prepend", () => {
    const f = prepend

    it("is equivalent to lifted Str.prepend", () => {
      fc.assert(
        fc.property(
          fc.string(),
          arb,
          (x, y) =>
            Str.prepend(x)(unNonEmptyString(y)) === unNonEmptyString(f(x)(y)),
        ),
      )
    })

    it("maintains newtype contract", () => {
      fc.assert(fc.property(fc.string(), arb, (x, y) => pipe(y, f(x), isValid)))
    })
  })

  describe("surround", () => {
    const f = surround

    it("is equivalent to lifted Str.surround", () => {
      fc.assert(
        fc.property(
          fc.string(),
          arb,
          (x, y) =>
            Str.surround(x)(unNonEmptyString(y)) === unNonEmptyString(f(x)(y)),
        ),
      )
    })

    it("maintains newtype contract", () => {
      fc.assert(fc.property(fc.string(), arb, (x, y) => pipe(y, f(x), isValid)))
    })
  })

  describe("toUpperCase", () => {
    const f = toUpperCase

    it("is equivalent to lifted Str.toUpperCase", () => {
      fc.assert(
        fc.property(
          arb,
          x => _toUpperCase(unNonEmptyString(x)) === unNonEmptyString(f(x)),
        ),
      )
    })

    it("maintains newtype contract", () => {
      fc.assert(fc.property(arb, flow(f, isValid)))
    })
  })

  describe("toLowerCase", () => {
    const f = toLowerCase

    it("is equivalent to lifted Str.toLowerCase", () => {
      fc.assert(
        fc.property(
          arb,
          x => _toLowerCase(unNonEmptyString(x)) === unNonEmptyString(f(x)),
        ),
      )
    })

    it("maintains newtype contract", () => {
      fc.assert(fc.property(arb, flow(f, isValid)))
    })
  })

  describe("reverse", () => {
    const f = reverse

    it("is equivalent to lifted Str.reverse", () => {
      fc.assert(
        fc.property(
          arb,
          x => Str.reverse(unNonEmptyString(x)) === unNonEmptyString(f(x)),
        ),
      )
    })

    it("maintains newtype contract", () => {
      fc.assert(fc.property(arb, flow(f, isValid)))
    })
  })

  describe("head", () => {
    const f = head

    it("is equivalent to lifted infallible Str.head", () => {
      fc.assert(
        fc.property(
          arb,
          x =>
            unsafeUnwrap(Str.head(unNonEmptyString(x))) ===
            unNonEmptyString(f(x)),
        ),
      )
    })

    it("maintains newtype contract", () => {
      fc.assert(fc.property(arb, flow(f, isValid)))
    })
  })

  describe("last", () => {
    const f = last

    it("is equivalent to lifted infallible Str.last", () => {
      fc.assert(
        fc.property(
          arb,
          x =>
            unsafeUnwrap(Str.last(unNonEmptyString(x))) ===
            unNonEmptyString(f(x)),
        ),
      )
    })

    it("maintains newtype contract", () => {
      fc.assert(fc.property(arb, flow(f, isValid)))
    })
  })
})
