---
title: Understanding the types
nav_order: 2
---

# Understanding the types

fp-ts-std and its documentation make use of some type aliases from [fp-ts](https://gcanti.github.io/fp-ts/modules/), as well as the idea of newtypes. This document is a brief overview of these types.

## Type aliases

As a refresher, type aliases hold no special value in the type system. They are merely placeholders that exist for convenience and/or to express semantic intent. For example, we could define a type alias representing email addresses like this:

```typescript
type Email = string;
```

It can be used interchangeably absolutely anywhere with `string`. This is in contrast to newtypes which are discussed later on below.

### Predicate

From [fp-ts/Predicate::Predicate](https://gcanti.github.io/fp-ts/modules/function.ts.html#predicate-interface), the `Predicate` type alias expresses a very common use case - a function that takes a value and returns a boolean having performed a check on said value.

```typescript
type Predicate<A> = (a: A) => boolean;
```

### Refinement

From [fp-ts/function::Refinement](https://gcanti.github.io/fp-ts/modules/function.ts.html#refinement-interface), the `Refinement` type alias is very similar to `Predicate`, but with one key difference - the returned boolean also acts as a _type guard_ on the function's input. If you're unfamiliar with type guards, check out the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards).

```typescript
type Refinement<A, B> = (a: A) => a is B;
```

Here's a trivial example of a type guard/refinement function:

```typescript
const isString = (x: unknown): x is string => typeof x === 'string';
```

Which could be rewritten slightly to utilise this type alias, marginally improving readability at a glance:

```typescript
const isString: Refinement<unknown, string> = (x): x is string => typeof x === 'string';
```

### Endomorphism

From [fp-ts/Endomorphism::Endomorphism](https://gcanti.github.io/fp-ts/modules/function.ts.html#endomorphism-interface), the `Endomorphism` type alias isn't nearly as scary as it sounds. Here's the type:

```typescript
type Endomorphism<A> = (a: A) => A;
```

It's just a function that takes and returns a value of the same type! If you're curious about the name, it comes from mathematics and category theory.

## Newtypes

fp-ts-std leverages newtypes via [newtype-ts](https://gcanti.github.io/newtype-ts/). Newtypes are like type aliases except they have a distinct, exclusive representation in the type system.

Here's how we might represent our `Email` type alias above instead as a newtype:

```typescript
import { Newtype } from 'newtype-ts';

type Email = Newtype<{ readonly Email: unique symbol }, string>;
```

Crucially, as mentioned, this `Email` type has a distinct representation in the type system, meaning that as far as the compiler is concerned `Email` and `string` are not interchangeable:

```typescript
import { iso } from 'newtype-ts';

declare const f: Endomorphism<Email>;

const str = 'example@domain.tld';
const email = iso<Email>().wrap(str);

f(str) // error! string is not Email
f(email) // ok
```

You may find it useful to research the idea of "smart constructors" as they pertain to newtypes. That enables us to push certain logical bugs almost entirely into the type system.

