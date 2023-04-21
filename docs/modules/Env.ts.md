---
title: Env.ts
nav_order: 10
parent: Modules
---

## Env overview

Helpers for working with the environment in Node.js (located at
`process.env`).

Added in v0.9.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [getParam](#getparam)
  - [getParamNonEmpty](#getparamnonempty)

---

# utils

## getParam

Attempt to get an environment parameter.

**Signature**

```ts
export declare const getParam: (k: string) => IOOption<string>
```

```hs
getParam :: string -> IOOption string
```

**Example**

```ts
import { getParam } from 'fp-ts-std/Env'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(getParam('example')(), O.none)
process.env['example'] = 'ciao'
assert.deepStrictEqual(getParam('example')(), O.some('ciao'))
```

Added in v0.9.0

## getParamNonEmpty

Attempt to get an environment parameter, filtering out empty strings.

**Signature**

```ts
export declare const getParamNonEmpty: (k: string) => IOOption<NonEmptyString>
```

```hs
getParamNonEmpty :: string -> IOOption NonEmptyString
```

**Example**

```ts
import { getParamNonEmpty } from 'fp-ts-std/Env'
import * as O from 'fp-ts/Option'

assert.deepStrictEqual(getParamNonEmpty('missing')(), O.none)

process.env['non-empty'] = 'ciao'
assert.deepStrictEqual(getParamNonEmpty('non-empty')(), O.some('ciao'))

process.env['empty'] = ''
assert.deepStrictEqual(getParamNonEmpty('empty')(), O.none)
```

Added in v0.9.0
