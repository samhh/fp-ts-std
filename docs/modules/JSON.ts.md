---
title: JSON.ts
nav_order: 11
parent: Modules
---

## JSON overview

Various functions to aid in working with JSON.

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [JSONString (type alias)](#jsonstring-type-alias)
  - [parse](#parse)
  - [parseO](#parseo)
  - [stringify](#stringify)
  - [stringifyO](#stringifyo)
  - [stringifyPrimitive](#stringifyprimitive)
  - [unJSONString](#unjsonstring)
  - [unstringify](#unstringify)

---

# utils

## JSONString (type alias)

Newtype representing stringified JSON.

**Signature**

```ts
export type JSONString = Newtype<{ readonly JSONString: unique symbol }, string>
```

```hs
newtype JSONString = string
```

Added in v0.5.0

## parse

Parse a string as JSON. The `Json` type on the right side comes from `fp-ts`
and is a union of all possible parsed types.

**Signature**

```ts
export declare const parse: <E>(f: (e: SyntaxError) => E) => (x: string) => Either<E, Json>
```

```hs
parse :: (SyntaxError -> e) -> string -> Either e Json
```

**Example**

```ts
import { parse } from 'fp-ts-std/JSON'
import * as E from 'fp-ts/Either'
import { constant } from 'fp-ts/function'

const f = parse(constant('e'))

const valid = '"abc"'
const invalid = 'abc'

assert.deepStrictEqual(f(valid), E.right('abc'))
assert.deepStrictEqual(f(invalid), E.left('e'))
```

Added in v0.1.0

## parseO

Parse a string as JSON, returning an `Option`.

**Signature**

```ts
export declare const parseO: (stringified: string) => Option<unknown>
```

```hs
parseO :: string -> Option unknown
```

**Example**

```ts
import { parseO } from 'fp-ts-std/JSON'
import * as O from 'fp-ts/Option'

const valid = '"abc"'
const invalid = 'abc'

assert.deepStrictEqual(parseO(valid), O.some('abc'))
assert.deepStrictEqual(parseO(invalid), O.none)
```

Added in v0.1.0

## stringify

Stringify some arbitrary data.

**Signature**

```ts
export declare const stringify: <E>(f: (e: TypeError) => E) => (x: unknown) => Either<E, JSONString>
```

```hs
stringify :: (TypeError -> e) -> unknown -> Either e JSONString
```

**Example**

```ts
import { stringify } from 'fp-ts-std/JSON'
import * as E from 'fp-ts/Either'
import { constant } from 'fp-ts/function'

const f = stringify(constant('e'))

const valid = 'abc'
const invalid = () => {}

assert.deepStrictEqual(f(valid), E.right('"abc"'))
assert.deepStrictEqual(f(invalid), E.left('e'))
```

Added in v0.1.0

## stringifyO

Stringify some arbitrary data, returning an `Option`.

**Signature**

```ts
export declare const stringifyO: (data: unknown) => Option<JSONString>
```

```hs
stringifyO :: unknown -> Option JSONString
```

**Example**

```ts
import { stringifyO } from 'fp-ts-std/JSON'
import * as O from 'fp-ts/Option'

const valid = 'abc'
const invalid = () => {}

assert.deepStrictEqual(stringifyO(valid), O.some('"abc"'))
assert.deepStrictEqual(stringifyO(invalid), O.none)
```

Added in v0.1.0

## stringifyPrimitive

Stringify a primitive value with no possibility of failure.

**Signature**

```ts
export declare const stringifyPrimitive: (x: string | number | boolean | null) => JSONString
```

```hs
stringifyPrimitive :: string | number | boolean | null -> JSONString
```

**Example**

```ts
import { stringifyPrimitive } from 'fp-ts-std/JSON'

assert.strictEqual(stringifyPrimitive('abc'), '"abc"')
```

Added in v0.1.0

## unJSONString

Unwrap a `JSONString` newtype back to its underlying string representation.

**Signature**

```ts
export declare const unJSONString: (s: JSONString) => string
```

```hs
unJSONString :: JSONString -> string
```

Added in v0.6.0

## unstringify

Parse a string as JSON. This is safe provided there have been no shenanigans
with the `JSONString` newtype.

**Signature**

```ts
export declare const unstringify: (x: JSONString) => unknown
```

```hs
unstringify :: JSONString -> unknown
```

**Example**

```ts
import { unstringify, stringifyPrimitive } from 'fp-ts-std/JSON'
import { flow } from 'fp-ts/function'

const f = flow(stringifyPrimitive, unstringify)

assert.strictEqual(f('abc'), 'abc')
```

Added in v0.5.0
