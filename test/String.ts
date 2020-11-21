import {
  lines,
  unlines,
  surround,
  unsurround,
  startsWith,
  endsWith,
  takeLeft,
  takeRight,
  reverse,
  match,
  matchAll,
  prepend,
  unprepend,
  append,
  unappend,
  contains,
  length,
  fromNumber,
  isString,
  isEmpty,
  trim,
  trimLeft,
  trimRight,
  split,
  test,
  dropLeftWhile,
  dropLeft,
  dropRight,
  head,
  tail,
  last,
  init,
} from "../src/String"
import * as O from "fp-ts/Option"
import * as NEA from "fp-ts/NonEmptyArray"
import { constFalse, constTrue, flow, pipe } from "fp-ts/function"
import fc from "fast-check"
import { invert } from "../src/Boolean"

describe("String", () => {
  describe("lines", () => {
    const f = lines

    it("splits on \\n newlines", () => {
      expect(f("")).toEqual([""])
      expect(f("\n")).toEqual(["", ""])
      expect(f("\n\n")).toEqual(["", "", ""])
      expect(f("\na")).toEqual(["", "a"])
      expect(f("a\n")).toEqual(["a", ""])
      expect(f("a\nb")).toEqual(["a", "b"])
    })

    it("splits on \\r newlines", () => {
      expect(f("")).toEqual([""])
      expect(f("\r")).toEqual(["", ""])
      expect(f("\r\r")).toEqual(["", "", ""])
      expect(f("\ra")).toEqual(["", "a"])
      expect(f("a\r")).toEqual(["a", ""])
      expect(f("a\rb")).toEqual(["a", "b"])
    })

    it("splits on \\r\\n newlines", () => {
      expect(f("")).toEqual([""])
      expect(f("\r\n")).toEqual(["", ""])
      expect(f("\r\n\r\n")).toEqual(["", "", ""])
      expect(f("\r\na")).toEqual(["", "a"])
      expect(f("a\r\n")).toEqual(["a", ""])
      expect(f("a\r\nb")).toEqual(["a", "b"])
    })
  })

  describe("unlines", () => {
    const f = unlines

    it("morphs empty array to empty string", () => {
      expect(f([])).toBe("")
    })

    it("extracts single string out of array", () => {
      expect(f(["a"])).toBe("a")
    })

    it("joins array of strings with newlines", () => {
      expect(f(["a", "b", "c"])).toBe("a\nb\nc")
    })
  })

  describe("surround", () => {
    const f = surround

    it("surrounds empty with empty", () => {
      expect(f("")("")).toBe("")
    })

    it("surrounds empty with non-empty", () => {
      expect(f("x")("")).toBe("xx")
    })

    it("surrounds non-empty with empty", () => {
      expect(f("")("x")).toBe("x")
    })

    it("surrounds non-empty with non-empty", () => {
      expect(f("x")("y")).toBe("xyx")
    })
  })

  describe("unsurround", () => {
    const f = unsurround

    it("unsurrounds empty from empty", () => {
      expect(f("")("")).toBe("")
    })

    it("unsurrounds empty from non-empty", () => {
      expect(f("x")("")).toBe("")
    })

    it("unsurrounds non-empty from empty", () => {
      expect(f("")("x")).toBe("x")
    })

    it("unsurrounds non-empty from non-empty", () => {
      expect(f("x")("y")).toBe("y")
      expect(f("x")("xy")).toBe("xy")
      expect(f("x")("yx")).toBe("yx")
      expect(f("x")("xyx")).toBe("y")
    })
  })

  describe("startsWith", () => {
    const f = startsWith

    it("returns true for empty substring", () => {
      fc.assert(fc.property(fc.string(), x => f("")(x)))
    })

    it("checks start of string for substring", () => {
      expect(f("x")("xyz")).toBe(true)
      expect(f("a")("xyz")).toBe(false)

      fc.assert(fc.property(fc.string(), fc.string(), (x, y) => f(x)(x + y)))
    })
  })

  describe("endsWith", () => {
    const f = endsWith

    it("returns true for empty substring", () => {
      fc.assert(fc.property(fc.string(), x => f("")(x)))
    })

    it("checks end of string for substring", () => {
      expect(f("z")("xyz")).toBe(true)
      expect(f("a")("xyz")).toBe(false)

      fc.assert(fc.property(fc.string(), fc.string(), (x, y) => f(x)(y + x)))
    })
  })

  describe("takeLeft", () => {
    const f = takeLeft

    it("takes the specified number of characters from the start", () => {
      expect(f(2)("abc")).toBe("ab")
    })

    it("returns empty string for non-positive number", () => {
      fc.assert(
        fc.property(fc.integer(0), fc.string(), (n, x) => f(n)(x) === ""),
      )
    })

    it("returns whole string for number that's too large", () => {
      fc.assert(
        fc.property(
          fc.string(),
          fc.integer(0, Number.MAX_SAFE_INTEGER),
          (x, n) => f(x.length + n)(x) === x,
        ),
      )
    })

    it("rounds float input down to nearest int", () => {
      const x = "abc"

      expect(f(0.1)(x)).toBe("")
      expect(f(0.9)(x)).toBe("")
      expect(f(1.1)(x)).toBe("a")
    })
  })

  describe("takeRight", () => {
    const f = takeRight

    it("takes the specified number of characters from the end", () => {
      expect(f(2)("abc")).toBe("bc")
    })

    it("returns empty string for non-positive number", () => {
      fc.assert(
        fc.property(fc.integer(0), fc.string(), (n, x) => f(n)(x) === ""),
      )
    })

    it("returns whole string for number that's too large", () => {
      fc.assert(
        fc.property(
          fc.string(),
          fc.integer(0, Number.MAX_SAFE_INTEGER),
          (x, n) => f(x.length + n)(x) === x,
        ),
      )
    })

    it("rounds float input down to nearest int", () => {
      const x = "abc"

      expect(f(0.1)(x)).toBe("")
      expect(f(0.9)(x)).toBe("")
      expect(f(1.1)(x)).toBe("c")
    })
  })

  describe("reverse", () => {
    const f = reverse

    it("reverses input string", () => {
      expect(f("")).toBe("")
      expect(f("ab c")).toBe("c ba")
    })
  })

  describe("contains", () => {
    const f = contains("abc")

    it("does not detect substring if not all present", () => {
      expect(f("")).toBe(false)
      expect(f("ab")).toBe(false)
      expect(f("bc")).toBe(false)
      expect(f("ac")).toBe(false)
    })

    it("does not detect substring of incorrect casing", () => {
      expect(f("aBc")).toBe(false)
    })

    it("does not detect substring out of order", () => {
      expect(f("acb")).toBe(false)
      expect(f("cba")).toBe(false)
      expect(f("axbc")).toBe(false)
    })

    it("detects present substring in-order", () => {
      expect(f("abc")).toBe(true)
      expect(f("xabc")).toBe(true)
      expect(f("abcx")).toBe(true)
      expect(f("xabcx")).toBe(true)
    })
  })

  describe("match", () => {
    // Jest won't deep match a plain array against RegExpMatchArray as it
    // includes extra non-enumerable properties
    const f = flow(
      match(/^(\d)(\w)$/),
      O.map(xs => Array.from(xs)),
    )

    it("works", () => {
      expect(f("2e")).toEqual(O.some(["2e", "2", "e"]))
      expect(f("foo")).toEqual(O.none)
    })
  })

  describe("matchAll", () => {
    const f = matchAll

    it("works with global regex", () => {
      // Jest won't deep match a plain array against RegExpMatchArray as
      // it includes extra non-enumerable properties
      const g = flow(f(/t(e)(st(\d?))/g), O.map(NEA.map(xs => Array.from(xs))))

      expect(g("test1test2")).toEqual(
        O.some([
          ["test1", "e", "st1", "1"],
          ["test2", "e", "st2", "2"],
        ]),
      )
      expect(g("foo")).toEqual(O.none)
    })

    it("does not throw with non-global regex", () => {
      fc.assert(
        fc.property(fc.string(), x => {
          // eslint-disable-next-line functional/no-expression-statement
          f(/x/)(x)
        }),
      )
    })
  })

  describe("prepend", () => {
    const f = prepend

    it("prepends", () => {
      expect(f("")("")).toBe("")
      expect(f("x")("")).toBe("x")
      expect(f("")("x")).toBe("x")
      expect(f("x")("yz")).toBe("xyz")

      fc.assert(
        fc.property(
          fc.string(),
          fc.string(),
          (x, y) =>
            f(x)(y).length === x.length + y.length &&
            f(y)(x).length === x.length + y.length,
        ),
      )
    })
  })

  describe("unprepend", () => {
    const f = unprepend

    it("does not unprepend what isn't there", () => {
      expect(f("")("")).toBe("")
      expect(f("x")("")).toBe("")
      expect(f("")("x")).toBe("x")
    })

    it("unprepends if present", () => {
      expect(f("x")("xy")).toBe("y")
      expect(f("x")("xx")).toBe("x")

      fc.assert(
        fc.property(fc.string(), fc.string(), (x, y) => f(x)(x + y) === y),
      )
    })
  })

  describe("append", () => {
    const f = append

    it("appends", () => {
      expect(f("")("")).toBe("")
      expect(f("x")("")).toBe("x")
      expect(f("")("x")).toBe("x")
      expect(f("z")("xy")).toBe("xyz")

      fc.assert(
        fc.property(
          fc.string(),
          fc.string(),
          (x, y) =>
            f(x)(y).length === x.length + y.length &&
            f(y)(x).length === x.length + y.length,
        ),
      )
    })
  })

  describe("unappend", () => {
    const f = unappend

    it("does not unappend what isn't there", () => {
      expect(f("")("")).toBe("")
      expect(f("x")("")).toBe("")
      expect(f("")("x")).toBe("x")
    })

    it("unappends if present", () => {
      expect(f("y")("xy")).toBe("x")
      expect(f("x")("xx")).toBe("x")

      fc.assert(
        fc.property(fc.string(), fc.string(), (x, y) => f(x)(y + x) === y),
      )
    })
  })

  describe("length", () => {
    const f = length

    it("returns length of string", () => {
      expect(f("")).toBe(0)
      expect(f("abc")).toBe(3)
    })

    it("returned value is always non-negative", () => {
      fc.assert(fc.property(fc.string(), xs => f(xs) >= 0))
    })
  })

  describe("fromNumber", () => {
    const f = fromNumber

    it("does not modify the number at all", () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.integer(), fc.float()),
          n => n === Number(f(n)),
        ),
      )
    })

    it("always returns a string", () => {
      fc.assert(
        fc.property(fc.oneof(fc.integer(), fc.float()), flow(f, isString)),
      )
    })
  })

  describe("isString", () => {
    const f = isString

    it("returns true for any string", () => {
      fc.assert(fc.property(fc.string(), f))
    })

    it("returns false for any other type", () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.integer(),
            fc.boolean(),
            fc.constant(null),
            fc.constant(undefined),
            fc.object(),
          ),
          flow(f, invert),
        ),
      )
    })
  })

  describe("isEmpty", () => {
    const f = isEmpty

    it("returns true if empty", () => {
      expect(f("")).toBe(true)
    })

    it("returns false for non-empty", () => {
      fc.assert(
        fc.property(
          fc.string().filter(x => x !== ""),
          flow(f, invert),
        ),
      )
    })
  })

  describe("trim", () => {
    const f = trim

    it("leaves alone that which doesn't require trimming", () => {
      expect(f("a b c")).toBe("a b c")
    })

    it("trims the left side", () => {
      expect(f(" a b c")).toBe("a b c")
      expect(f("  a b c")).toBe("a b c")
    })

    it("trims the right side", () => {
      expect(f("a b c ")).toBe("a b c")
      expect(f("a b c  ")).toBe("a b c")
    })

    it("trims both sides", () => {
      expect(f(" a b c ")).toBe("a b c")
      expect(f("  a b c  ")).toBe("a b c")
    })

    it("never leaves whitespaces as head or last char", () => {
      fc.assert(
        fc.property(
          fc.string(),
          flow(f, x => x[0] !== " " && x[Math.max(0, x.length - 1)] !== " "),
        ),
      )
    })
  })

  describe("trimLeft", () => {
    const f = trimLeft

    it("leaves alone that which doesn't require trimming", () => {
      expect(f("a b c")).toBe("a b c")
    })

    it("trims the left side", () => {
      expect(f(" a b c")).toBe("a b c")
      expect(f("  a b c")).toBe("a b c")
    })

    it("does not trim the right side", () => {
      expect(f("a b c ")).toBe("a b c ")
      expect(f("a b c  ")).toBe("a b c  ")
    })

    it("never leaves whitespaces as head char", () => {
      fc.assert(
        fc.property(
          fc.string(),
          flow(f, x => x[0] !== " "),
        ),
      )
    })
  })

  describe("trimRight", () => {
    const f = trimRight

    it("leaves alone that which doesn't require trimming", () => {
      expect(f("a b c")).toBe("a b c")
    })

    it("trims the right side", () => {
      expect(f("a b c ")).toBe("a b c")
      expect(f("a b c  ")).toBe("a b c")
    })

    it("does not trim the left side", () => {
      expect(f(" a b c")).toBe(" a b c")
      expect(f("  a b c")).toBe("  a b c")
    })

    it("never leaves whitespaces as last char", () => {
      fc.assert(
        fc.property(
          fc.string(),
          flow(f, x => x[Math.max(0, x.length - 1)] !== " "),
        ),
      )
    })
  })

  describe("split", () => {
    const g = split

    describe("splits on regexp", () => {
      const f = g(/\.\./)

      it("lifts unmodified string which cannot be split", () => {
        expect(f(".")).toEqual(["."])
        expect(f(".x.")).toEqual([".x."])
      })

      it("splits on each recognised", () => {
        expect(f("a..b")).toEqual(["a", "b"])
        expect(f("a..b..")).toEqual(["a", "b", ""])
        expect(f("..a..b")).toEqual(["", "a", "b"])
        expect(f("..a..b..")).toEqual(["", "a", "b", ""])
        expect(f(".....")).toEqual(["", "", "."])
      })
    })

    describe("splits on string", () => {
      const f = g("..")

      it("lifts unmodified string which cannot be split", () => {
        expect(f(".")).toEqual(["."])
        expect(f(".x.")).toEqual([".x."])
      })

      it("splits on each recognised", () => {
        expect(f("a..b")).toEqual(["a", "b"])
        expect(f("a..b..")).toEqual(["a", "b", ""])
        expect(f("..a..b")).toEqual(["", "a", "b"])
        expect(f("..a..b..")).toEqual(["", "a", "b", ""])
        expect(f(".....")).toEqual(["", "", "."])

        fc.assert(
          fc.property(
            fc.string(),
            x => f(x).length === Array.from(x.matchAll(/\.\./g)).length + 1,
          ),
        )
      })
    })
  })

  describe("test", () => {
    const f = test(/x.z/)

    it("works", () => {
      expect(f("xyz")).toBe(true)
      expect(f("axyzb")).toBe(true)
      expect(f("ayz")).toBe(false)
      expect(f("xya")).toBe(false)
    })
  })

  describe("dropLeft", () => {
    const f = dropLeft

    it("returns identity for non-positive number", () => {
      expect(f(-1)("abc")).toBe("abc")

      fc.assert(
        fc.property(fc.string(), fc.integer(0), (x, n) => f(n)(x) === x),
      )
    })

    it("rounds float down to nearest integer", () => {
      expect(f(0.99)("abc")).toBe("abc")
      expect(f(1.01)("abc")).toBe("bc")
    })

    it("drops specified number of characters", () => {
      expect(f(2)("abc")).toBe("c")

      fc.assert(
        fc.property(
          fc.string(),
          fc.integer(0, Number.MAX_SAFE_INTEGER),
          (x, n) => f(n)(x).length === Math.max(0, x.length - n),
        ),
      )
    })
  })

  describe("dropLeftWhile", () => {
    const f = dropLeftWhile

    it("returns identity on constFalse", () => {
      fc.assert(fc.property(fc.string(), x => f(constFalse)(x) === x))
    })

    it("returns empty on constTrue", () => {
      fc.assert(fc.property(fc.string(), x => f(constTrue)(x) === ""))
    })

    it("drops until a match", () => {
      expect(f(x => x !== "d")("abcdef")).toBe("def")
    })
  })

  describe("dropRight", () => {
    const f = dropRight

    it("returns identity for non-positive number", () => {
      expect(f(-1)("abc")).toBe("abc")

      fc.assert(
        fc.property(fc.string(), fc.integer(0), (x, n) => f(n)(x) === x),
      )
    })

    it("rounds float down to nearest integer", () => {
      expect(f(0.99)("abc")).toBe("abc")
      expect(f(1.01)("abc")).toBe("ab")
    })

    it("drops specified number of characters", () => {
      expect(f(2)("abc")).toBe("a")

      fc.assert(
        fc.property(
          fc.string(),
          fc.integer(0, Number.MAX_SAFE_INTEGER),
          (x, n) => f(n)(x).length === Math.max(0, x.length - n),
        ),
      )
    })
  })

  describe("head", () => {
    const f = head

    it("returns None for empty string", () => {
      expect(f("")).toEqual(O.none)
    })

    it("returns first character of non-empty string", () => {
      fc.assert(
        fc.property(fc.string(1, 100), x => expect(f(x)).toEqual(O.some(x[0]))),
      )
    })
  })

  describe("tail", () => {
    const f = tail

    it("returns None for empty string", () => {
      expect(f("")).toEqual(O.none)
    })

    it("returns empty string for string with one character", () => {
      fc.assert(
        fc.property(fc.string(1, 1), x => expect(f(x)).toEqual(O.some(""))),
      )
    })

    it("returns string with all but first character for length >= 2", () => {
      expect(f("xy")).toEqual(O.some("y"))
      expect(f("xyz")).toEqual(O.some("yz"))
    })

    it("returns string one character smaller", () => {
      fc.assert(
        fc.property(fc.string(1, 100), x =>
          pipe(
            f(x),
            O.exists(y => y.length === x.length - 1),
          ),
        ),
      )
    })
  })

  describe("last", () => {
    const f = last

    it("returns None for empty string", () => {
      expect(f("")).toEqual(O.none)
    })

    it("returns last character of non-empty string", () => {
      fc.assert(
        fc.property(fc.string(1, 100), x =>
          expect(f(x)).toEqual(O.some(x[x.length - 1])),
        ),
      )
    })
  })

  describe("init", () => {
    const f = init

    it("returns None for empty string", () => {
      expect(f("")).toEqual(O.none)
    })

    it("returns empty string for string with one character", () => {
      fc.assert(
        fc.property(fc.string(1, 1), x => expect(f(x)).toEqual(O.some(""))),
      )
    })

    it("returns string with all but last character for length >= 2", () => {
      expect(f("xy")).toEqual(O.some("x"))
      expect(f("xyz")).toEqual(O.some("xy"))
    })

    it("returns string one character smaller", () => {
      fc.assert(
        fc.property(fc.string(1, 100), x =>
          pipe(
            f(x),
            O.exists(y => y.length === x.length - 1),
          ),
        ),
      )
    })
  })
})
