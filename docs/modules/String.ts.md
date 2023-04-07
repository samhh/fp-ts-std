---
title: String.ts
nav_order: 36
parent: Modules
---

## String overview

Various functions to aid in working with strings.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [append](#append)
  - [dropLeft](#dropleft)
  - [dropLeftWhile](#dropleftwhile)
  - [dropRight](#dropright)
  - [dropRightWhile](#droprightwhile)
  - [fromNumber](#fromnumber)
  - [head](#head)
  - [init](#init)
  - [isAlpha](#isalpha)
  - [isAlphaNum](#isalphanum)
  - [isLower](#islower)
  - [isSpace](#isspace)
  - [isUpper](#isupper)
  - [last](#last)
  - [lines](#lines)
  - [lookup](#lookup)
  - [match](#match)
  - [matchAll](#matchall)
  - [prepend](#prepend)
  - [replaceAll](#replaceall)
  - [reverse](#reverse)
  - [splitAt](#splitat)
  - [surround](#surround)
  - [tail](#tail)
  - [takeLeft](#takeleft)
  - [takeLeftWhile](#takeleftwhile)
  - [takeRight](#takeright)
  - [takeRightWhile](#takerightwhile)
  - [test](#test)
  - [unappend](#unappend)
  - [under](#under)
  - [unlines](#unlines)
  - [unprepend](#unprepend)
  - [unsurround](#unsurround)
  - [unwords](#unwords)
  - [words](#words)

---

# utils

## append

Append one string to another.

**Signature**

```ts
export declare const append: (appended: string) => Endomorphism<string>
```

**Example**

```ts
import { append } from 'fp-ts-std/String'

const withExt = append('.hs')

assert.strictEqual(withExt('File'), 'File.hs')
```

Added in v0.1.0

## dropLeft

Drop a number of characters from the start of a string, returning a new
string.

If `n` is larger than the available number of characters, an empty string
will be returned.

If `n` is not a positive number, the string will be returned whole.

If `n` is a float, it will be rounded down to the nearest integer.

**Signature**

```ts
export declare const dropLeft: (n: number) => Endomorphism<string>
```

**Example**

```ts
import { dropLeft } from 'fp-ts-std/String'

assert.strictEqual(dropLeft(2)('abc'), 'c')
```

Added in v0.6.0

## dropLeftWhile

Remove the longest initial substring for which all characters satisfy the
specified predicate, creating a new string.

**Signature**

```ts
export declare const dropLeftWhile: (f: Predicate<string>) => Endomorphism<string>
```

**Example**

```ts
import { dropLeftWhile } from 'fp-ts-std/String'

const dropFilename = dropLeftWhile((x) => x !== '.')

assert.strictEqual(dropFilename('File.hs'), '.hs')
```

Added in v0.6.0

## dropRight

Drop a number of characters from the end of a string, returning a new
string.

If `n` is larger than the available number of characters, an empty string
will be returned.

If `n` is not a positive number, the string will be returned whole.

If `n` is a float, it will be rounded down to the nearest integer.

**Signature**

```ts
export declare const dropRight: (n: number) => Endomorphism<string>
```

**Example**

```ts
import { dropRight } from 'fp-ts-std/String'

assert.strictEqual(dropRight(2)('abc'), 'a')
```

Added in v0.3.0

## dropRightWhile

Remove the longest initial substring from the end of the input string for
which all characters satisfy the specified predicate, creating a new string.

**Signature**

```ts
export declare const dropRightWhile: (f: Predicate<string>) => Endomorphism<string>
```

**Example**

```ts
import { dropRightWhile } from 'fp-ts-std/String'
import { elemV } from 'fp-ts-std/Array'
import { eqString } from 'fp-ts/Eq'

const isVowel = elemV(eqString)(['a', 'e', 'i', 'o', 'u'])
const dropRightVowels = dropRightWhile(isVowel)

assert.deepStrictEqual(dropRightVowels('hellooo'), 'hell')
```

Added in v0.7.0

## fromNumber

Convert a number to a string.

**Signature**

```ts
export declare const fromNumber: (x: number) => string
```

**Example**

```ts
import { fromNumber } from 'fp-ts-std/String'

assert.strictEqual(fromNumber(3), '3')
```

Added in v0.1.0

## head

Get the first character in a string, or `None` if the string is empty.

**Signature**

```ts
export declare const head: (x: string) => Option<string>
```

**Example**

```ts
import { head } from 'fp-ts-std/String'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(head('abc'), O.some('a'))
assert.deepStrictEqual(head(''), O.none)
```

Added in v0.6.0

## init

Get all but the last character of a string, or `None` if the string is empty.

**Signature**

```ts
export declare const init: (x: string) => Option<string>
```

**Example**

```ts
import { init } from 'fp-ts-std/String'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(init(''), O.none)
assert.deepStrictEqual(init('a'), O.some(''))
assert.deepStrictEqual(init('ab'), O.some('a'))
assert.deepStrictEqual(init('abc'), O.some('ab'))
```

Added in v0.7.0

## isAlpha

Tests if a string exclusively consists of alphabetic characters. Behaviour
in case of an empty string is unspecified.

**Signature**

```ts
export declare const isAlpha: Predicate<string>
```

**Example**

```ts
import { isAlpha } from 'fp-ts-std/String'

assert.strictEqual(isAlpha('abc'), true)
assert.strictEqual(isAlpha('123'), false)
assert.strictEqual(isAlpha('abc123'), false)
```

Added in v0.11.0

## isAlphaNum

Tests if a string exclusively consists of alphabetic or numeric characters.
Behaviour in case of an empty string is unspecified.

**Signature**

```ts
export declare const isAlphaNum: Predicate<string>
```

**Example**

```ts
import { isAlphaNum } from 'fp-ts-std/String'

assert.strictEqual(isAlphaNum('abc123'), true)
assert.strictEqual(isAlphaNum('abc123!'), false)
```

Added in v0.11.0

## isLower

Tests if a string exclusively consists of lowercase alphabetic characters.
Behaviour in case of an empty string is unspecified.

**Signature**

```ts
export declare const isLower: Predicate<string>
```

**Example**

```ts
import { isLower } from 'fp-ts-std/String'

assert.strictEqual(isLower('hello'), true)
assert.strictEqual(isLower('Hello'), false)
assert.strictEqual(isLower('hello1'), false)
```

Added in v0.11.0

## isSpace

Tests if a string exclusively consists of whitespace. Behaviour in case of
an empty string is unspecified.

**Signature**

```ts
export declare const isSpace: Predicate<string>
```

**Example**

```ts
import { isSpace } from 'fp-ts-std/String'

assert.strictEqual(isSpace(' '), true)
assert.strictEqual(isSpace('x'), false)
assert.strictEqual(isSpace('\n\t'), true)
```

Added in v0.13.0

## isUpper

Tests if a string exclusively consists of uppercase alphabetic characters.
Behaviour in case of an empty string is unspecified.

**Signature**

```ts
export declare const isUpper: Predicate<string>
```

**Example**

```ts
import { isUpper } from 'fp-ts-std/String'

assert.strictEqual(isUpper('HELLO'), true)
assert.strictEqual(isUpper('Hello'), false)
assert.strictEqual(isUpper('HELLO1'), false)
```

Added in v0.11.0

## last

Get the last character in a string, or `None` if the string is empty.

**Signature**

```ts
export declare const last: (x: string) => Option<string>
```

**Example**

```ts
import { last } from 'fp-ts-std/String'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(last('abc'), O.some('c'))
assert.deepStrictEqual(last(''), O.none)
```

Added in v0.7.0

## lines

Split a string into substrings using any recognised newline as the separator.

**Signature**

```ts
export declare const lines: (s: string) => ReadonlyNonEmptyArray<string>
```

**Example**

```ts
import { lines } from 'fp-ts-std/String'

assert.deepStrictEqual(lines('a\nb\nc'), ['a', 'b', 'c'])
```

Added in v0.1.0

## lookup

Attempt to access the character at the specified index of a string.

**Signature**

```ts
export declare const lookup: (i: number) => (x: string) => Option<string>
```

**Example**

```ts
import { lookup } from 'fp-ts-std/String'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(lookup(0)(''), O.none)
assert.deepStrictEqual(lookup(0)('abc'), O.some('a'))
```

Added in v0.7.0

## match

Functional wrapper around `String.prototype.match`.

**Signature**

```ts
export declare const match: (r: RegExp) => (x: string) => Option<RegExpMatchArray>
```

**Example**

```ts
import { match } from 'fp-ts-std/String'
import * as O from 'fp-ts/Option'
import { flow } from 'fp-ts/function'

const f = flow(
  match(/^(\d)(\w)$/),
  O.map((xs) => Array.from(xs))
)

assert.deepStrictEqual(f('2e'), O.some(['2e', '2', 'e']))
assert.deepStrictEqual(f('foo'), O.none)
```

Added in v0.1.0

## matchAll

A functional wrapper around `String.prototype.matchAll`.

If the provided `RegExp` is non-global, the function will return `None`.

**Signature**

```ts
export declare const matchAll: (r: RegExp) => (x: string) => Option<NonEmptyArray<RegExpMatchArray>>
```

**Example**

```ts
import { matchAll } from 'fp-ts-std/String'
import * as O from 'fp-ts/Option'
import * as NEA from 'fp-ts/NonEmptyArray'
import { flow } from 'fp-ts/function'

const f = flow(matchAll(/t(e)(st(\d?))/g), O.map(NEA.map((xs) => Array.from(xs))))

assert.deepStrictEqual(
  f('test1test2'),
  O.some([
    ['test1', 'e', 'st1', '1'],
    ['test2', 'e', 'st2', '2'],
  ])
)
```

Added in v0.5.0

## prepend

Prepend one string to another.

**Signature**

```ts
export declare const prepend: (prepended: string) => Endomorphism<string>
```

**Example**

```ts
import { prepend } from 'fp-ts-std/String'

const prependShell = prepend('$ ')

assert.strictEqual(prependShell('abc'), '$ abc')
```

Added in v0.1.0

## replaceAll

Replace every occurrence of a matched substring with a replacement.

To use a `RegExp` (with a global flag) instead of a string to match, use
`replace` in `fp-ts/string` instead.

**Signature**

```ts
export declare const replaceAll: (r: string) => (s: string) => Endomorphism<string>
```

**Example**

```ts
import { replaceAll } from 'fp-ts-std/String'

assert.strictEqual(replaceAll('foo')('bar')('foo foo foo'), 'bar bar bar')
```

Added in v0.7.0

## reverse

Reverse a string.

**Signature**

```ts
export declare const reverse: Endomorphism<string>
```

**Example**

```ts
import { reverse } from 'fp-ts-std/String'

assert.strictEqual(reverse('abc'), 'cba')
```

Added in v0.3.0

## splitAt

Partition a string into parts at an index.
Resulting parts can then be handled using fp-ts/Tuple.

**Signature**

```ts
export declare const splitAt: (index: number) => (str: string) => [string, string]
```

**Example**

```ts
import { splitAt } from 'fp-ts-std/String'

assert.deepStrictEqual(splitAt(1)('abc'), ['a', 'bc'])
```

Added in v0.11.0

## surround

Surround a string. Equivalent to calling `prepend` and `append` with the
same outer value.

**Signature**

```ts
export declare const surround: (x: string) => Endomorphism<string>
```

**Example**

```ts
import { surround } from 'fp-ts-std/String'

const quote = surround('"')

assert.strictEqual(quote('abc'), '"abc"')
```

Added in v0.1.0

## tail

Get all but the first character of a string, or `None` if the string is empty.

**Signature**

```ts
export declare const tail: (x: string) => Option<string>
```

**Example**

```ts
import { tail } from 'fp-ts-std/String'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(tail(''), O.none)
assert.deepStrictEqual(tail('a'), O.some(''))
assert.deepStrictEqual(tail('ab'), O.some('b'))
assert.deepStrictEqual(tail('abc'), O.some('bc'))
```

Added in v0.6.0

## takeLeft

Keep the specified number of characters from the start of a string.

If `n` is larger than the available number of characters, the string will
be returned whole.

If `n` is not a positive number, an empty string will be returned.

If `n` is a float, it will be rounded down to the nearest integer.

**Signature**

```ts
export declare const takeLeft: (n: number) => Endomorphism<string>
```

**Example**

```ts
import { takeLeft } from 'fp-ts-std/String'

assert.strictEqual(takeLeft(2)('abc'), 'ab')
```

Added in v0.3.0

## takeLeftWhile

Calculate the longest initial substring for which all characters satisfy the
specified predicate, creating a new string.

**Signature**

```ts
export declare const takeLeftWhile: (f: Predicate<string>) => Endomorphism<string>
```

**Example**

```ts
import { takeLeftWhile } from 'fp-ts-std/String'

assert.deepStrictEqual(takeLeftWhile((x) => x !== 'c')('abcd'), 'ab')
```

Added in v0.7.0

## takeRight

Keep the specified number of characters from the end of a string.

If `n` is larger than the available number of characters, the string will
be returned whole.

If `n` is not a positive number, an empty string will be returned.

If `n` is a float, it will be rounded down to the nearest integer.

**Signature**

```ts
export declare const takeRight: (n: number) => Endomorphism<string>
```

**Example**

```ts
import { takeRight } from 'fp-ts-std/String'

assert.strictEqual(takeRight(2)('abc'), 'bc')
```

Added in v0.3.0

## takeRightWhile

Calculate the longest initial substring from the end of the input string
for which all characters satisfy the specified predicate, creating a new
string.

**Signature**

```ts
export declare const takeRightWhile: (f: Predicate<string>) => Endomorphism<string>
```

**Example**

```ts
import { takeRightWhile } from 'fp-ts-std/String'

assert.deepStrictEqual(takeRightWhile((x) => x !== 'b')('abcd'), 'cd')
```

Added in v0.7.0

## test

A functional wrapper around `RegExp.prototype.test`.

**Signature**

```ts
export declare const test: (r: RegExp) => Predicate<string>
```

**Example**

```ts
import { test } from 'fp-ts-std/String'

const hasVowel = test(/(a|e|i|o|u)/)

assert.strictEqual(hasVowel('meow'), true)
assert.strictEqual(hasVowel('grrr'), false)
```

Added in v0.1.0

## unappend

Remove the end of a string, if it exists.

**Signature**

```ts
export declare const unappend: (end: string) => Endomorphism<string>
```

**Example**

```ts
import { unappend } from 'fp-ts-std/String'

const withoutExt = unappend('.hs')

assert.strictEqual(withoutExt('File.hs'), 'File')
```

Added in v0.1.0

## under

Apply an endomorphism upon an array of strings (characters) against a string.
This is useful as it allows you to run many polymorphic functions targeting
arrays against strings without having to rewrite them.

The name "under" is borrowed from newtypes, and expresses the notion that
a string can be thought of merely as an array of characters.

**Signature**

```ts
export declare const under: (f: Endomorphism<ReadonlyArray<string>>) => Endomorphism<string>
```

**Example**

```ts
import { under } from 'fp-ts-std/String'
import * as RA from 'fp-ts/ReadonlyArray'

const filterOutX = under(RA.filter((x) => x !== 'x'))

assert.strictEqual(filterOutX('axbxc'), 'abc')
```

Added in v0.7.0

## unlines

Join newline-separated strings together.

**Signature**

```ts
export declare const unlines: (ys: readonly string[]) => string
```

**Example**

```ts
import { unlines } from 'fp-ts-std/String'

assert.strictEqual(unlines(['a', 'b', 'c']), 'a\nb\nc')
```

Added in v0.1.0

## unprepend

Remove the beginning of a string, if it exists.

**Signature**

```ts
export declare const unprepend: (start: string) => Endomorphism<string>
```

**Example**

```ts
import { unprepend } from 'fp-ts-std/String'

const unprependShell = unprepend('$ ')

assert.strictEqual(unprependShell('$ abc'), 'abc')
```

Added in v0.1.0

## unsurround

Remove the start and end of a string, if they both exist.

**Signature**

```ts
export declare const unsurround: (x: string) => Endomorphism<string>
```

**Example**

```ts
import { unsurround } from 'fp-ts-std/String'

const unquote = unsurround('"')

assert.strictEqual(unquote('"abc"'), 'abc')
```

Added in v0.1.0

## unwords

Join whitespace-separated strings together.

**Signature**

```ts
export declare const unwords: (ys: readonly string[]) => string
```

**Example**

```ts
import { unwords } from 'fp-ts-std/String'

assert.strictEqual(unwords(['a', 'b', 'c']), 'a b c')
```

Added in v0.14.0

## words

Split a string into substrings using any recognised whitespace as the
separator.

**Signature**

```ts
export declare const words: (s: string) => ReadonlyNonEmptyArray<string>
```

**Example**

```ts
import { words } from 'fp-ts-std/String'

assert.deepStrictEqual(words('a b\nc'), ['a', 'b', 'c'])
```

Added in v0.14.0
