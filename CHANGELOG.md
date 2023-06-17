# Changelog

This project adheres to semantic versioning.

## 0.17.1 (2023-06-17)

- Fix widening of additional type arguments in `pass`.

## 0.17.0 (2023-06-17)

- Add `URLPath` module.
- Add `pass` to `Applicative`, `IO`, `IOOption`, `IOEither`, `Task`, `TaskOption`, and `TaskEither`.
- Add `Bounded` instance to `Boolean`.
- Add `match2`, `getBounded`, and `getOrd` to `Either`.
- Add `applyN` and some do notation helpers to `Function`.
- Add the do notation helper `let` to `Lazy`.
- Add `includes`, `size`, and `split` to `NonEmptyString`.
- Add `digits` and alternative "Safe" `Bounded` instance to `Number`.
- Add `match2` and `getBounded` to `Option`.
- Add `get` to `Struct` and `ReadonlyStruct`.
- Add `getEq`, `getOrd`, and `getBounded` to `Tuple`.
- Add `clone` to `URL`.
- Add `toRecord`, `toString`, and `toTuples` to `URLSearchParams`.
- Unsafe unwrapping and expectation functions now wrap all thrown values in an `Error` object, providing a stack trace.
- Return a cleanup function in `addEventListener`, and add `addEventListener_`. Narrow the event type/target of each.
- Remove index module. It's unfriendly to tree-shaking and less flexible than the [facades pattern](https://samhh.github.io/fp-ts-std/facades.html).
- Remove `mapBoth` from `IOEither` and `TaskEither` as they're superceded by [fp-ts/IOEither::mapBoth](https://gcanti.github.io/fp-ts/modules/IOEither.ts.html#mapboth) and [fp-ts/TaskEither::mapBoth](https://gcanti.github.io/fp-ts/modules/TaskEither.ts.html#mapboth) respectively.
- Remove `tap` from `IO` as it's superceded by [fp-ts/IO::tap](https://gcanti.github.io/fp-ts/modules/IO.ts.html#tap).
- Improve safety and inference of `isInstanceOf`.
- Adjust the input type of `fromRecord` in `URLSearchParams`.
- Narrow return type of `getParamNonEmpty` in `Env` to `NonEmptyString`.
- Add `flatMap` aliases.
- Support TypeScript's `node16`/`nodenext` module resolutions.
- Fix symbol property name of `JSONString` newtype.
- Bump minimum supported fp-ts version to 2.16.0.
- Add experimental `Enum` module.

## 0.16.0 (2023-04-10)

- Add `IOOption` module.
- Add `ReaderIO` module.
- Add `separateNE` to `Array` and `ReadonlyArray`.
- Add `traceShowWithValue` to `Debug`.
- Add `unsafeExpect` and `unsafeExpectLeft` to `Either`.
- Add `unsafeExpect` and `unsafeExpectLeft` to `IOEither`.
- Add `whenM` and `unlessM` to `Monad`.
- Add `unsafeExpect` to `Option`.
- Add `asksEither` to `ReaderEither`.
- Add `asksTask` to `ReaderTask`.
- Add `asksEither`, `asksTask`, and `asksTaskEither` to `ReaderTaskEither`.
- Add `pick` and `omit` to `Record` and `ReadonlyRecord`.
- Add `unsafeExpect` and `unsafeExpectLeft` to `TaskEither`.
- Add `unsafeExpect` to `TaskOption`.
- Add `getAllForParam` and `isEmpty` to `URLSearchParams`.
- Remove `flip`. [fp-ts/function::flip](https://gcanti.github.io/fp-ts/modules/function.ts.html#flip) is now curried.
- Fix statefulness of `Str.test`.
- Throw upon attempting to unsafely lift an empty string to `NonEmptyString`.
- Improve `merge` type inferrence.
- Bump minimum supported fp-ts version to 2.13.1.
- Rename `is` in `Function` to `isInstanceOf` for readability.
- Bump minimum supported Node LTS to v18.

## 0.15.1 (2022-11-18)

- Fix symbol property name of `NonEmptyString` newtype.

## 0.15.0 (2022-09-11)

- Add `IOEither` module.
- Add `Monad` module.
- Add `Newtype` module.
- Add `NonEmptyString` module.
- Add `Reader` module.
- Add `ReaderEither` module.
- Add `ReaderTask` module.
- Add `ReaderTaskEither` module.
- Add `TaskOption` module.
- Add `altAllBy` to `Alternative` and `Option`.
- Add `allM` and `anyM` to `Array` and `ReadonlyArray`.
- Add `omitFrom`, `renameKey`, and `withDefaults` to `Struct` and `ReadonlyStruct`.
- Add `fanout` to `Tuple`.
- Add various voided sequencing functions.
- Add `Functor`, `Applicative`, and `Monad` instances to `Function`.
- Lazily evaluate the values in `memptyWhen`, `memptyUnless`, and `pureIf`.
- Stop permitting unknown keys in `omit`, reverting a change in 0.5.1.
- Add missing re-exports to index module.
- Bump minimum supported TypeScript version to 4.7.0.

## 0.14.2 (2022-05-11)

- Fix previous release, which was mistakenly identical to 0.14.0.

## 0.14.1 (2022-05-11)

- Extend various functions' type definitions to support subtyping.

## 0.14.0 (2022-05-11)

- Add `Bifunctor` module.
- Add `Struct` and `ReadonlyStruct` modules. Some of the functions from `Record` and `ReadonlyRecord` respectively have been moved there.
- Add `fromIterable` to `Array` and `ReadonlyArray`.
- Add `fromReadonly` and `toReadonly` to `Array`.
- Add `toUTCString` to `Date`.
- Add `mapBoth` to `Either`.
- Add `invokeNullary` to `Function`.
- Add `memoize` to `IO`.
- Add `memoize` to `Lazy`.
- Add `words` and `unwords` to `String`.
- Add `mapBoth` to `TaskEither`.
- Add `mapBoth` to `Tuple`.
- Fix behaviour of `pick` and `pickFrom` in `Struct` (previously `Record`) with regards to optional properties.
- Bump minimum supported Node LTS to v14.

## 0.13.1 (2022-01-16)

- Support Node LTS (and latest evergreen browsers). This includes patching support for `replaceAll` in `String`.
- Fix CJS imports of the index module.

## 0.13.0 (2021-12-16)

- Add `Alternative` module.
- Add `Isomorphism` module.
- Add `applySomes` to `Function`.
- Add `lazy` to `Lazy`.
- Add `memptyWhen` and `memptyUnless` to `Monoid`.
- Add `isPositive`, `isNegative`, `isNonNegative`, and `isNonPositive` to `Number`.
- Add `memptyWhen`, `memptyUnless`, and `pureIf` to `Option`.
- Add `isSpace` to `String`.
- Remove support for variadic/non-unary functions from `flip`.
- Rename the "Flipped" suffix wherever present to "V".
- Bump minimum supported monocle-ts version to 2.3.0.

## 0.12.0 (2021-12-01)

- Add ESM support for tree shaking. Note that your bundler or Node environment must now support [conditional exports](https://nodejs.org/api/packages.html#conditional-exports), else you'll need to import directly from a `dist/(cjs|esm)/` subdirectory.
- Add `Applicative` module.
- Add `DOM` module.
- Add `Lazy` module.
- Add `Monoid` module.
- Add `Ordering` module.
- Add `Predicate` module. Some of the functions from `Boolean` have been moved here.
- Add `Random` module.
- Add `Show` module.
- Add `TaskEither` module.
- Add `Tuple` module.
- Add `applyEvery`, `converge`, `invoke`, `invokeOn`, and `is` to `Function`.
- Add `when`, `unless`, `whenInvocationCount`, and `execute` to `IO`.
- Add `when`, `unless`, and `execute` to `Task`.
- Add `isFinite` and `toFinite` to `Number`.
- Add `noneAs`, `invert`, and `toMonoid` to `Option`.
- Add `extractAt` to `Array` and `ReadonlyArray`.
- Duplicate `filterA` from fp-ts-contrib into `Array` and `ReadonlyArray`.
- Replace `pick` in `Record` and `ReadonlyRecord` with a non-thunked version. The old implementation is now called `pickFrom`.
- Narrow the type of the first parameter in `replaceAll`. This reverts the change made in 0.10.1.
- Remove `both` and `either` from `Predicate` (formerly `Boolean`) as they're superceded by [and](https://gcanti.github.io/fp-ts/modules/Predicate.ts.html#and) and [or](https://gcanti.github.io/fp-ts/modules/Predicate.ts.html#or) respectively.

## 0.11.0 (2021-08-09)

- Add `isAlpha`, `isAlphaNum`, `isLower`, `isUpper`, and `splitAt` to `String`.
- Add `zipAll` to `Array` and `ReadonlyArray`.
- Add `fork` to `Function`.
- A few function signatures now use readonly arrays as opposed to regular arrays as a result of the following supercessions.
- Remove `contains`, `endsWith`, `isString`, `replace`, `slice`, `split`, `startsWith`, `toLower`, `toUpper`, `trim`, `trimLeft`, and `trimRight` from `String` as they've been superceded by new additions to [fp-ts/string](https://gcanti.github.io/fp-ts/modules/string.ts.html).
- Remove `applyTo` from `Function` as it's superceded by [fp-ts/function::apply](https://gcanti.github.io/fp-ts/modules/function.ts.html#apply).
- Remove `concat` from `Array` and `ReadonlyArray` as it's superceded by [fp-ts/Array::concat](https://gcanti.github.io/fp-ts/modules/Array.ts.html#concat)/[fp-ts/ReadonlyArray::concat](https://gcanti.github.io/fp-ts/modules/ReadonlyArray.ts.html#concat).
- Remove `length` from `ReadonlyArray` as it's superceded by [fp-ts/ReadonlyArray::size](https://gcanti.github.io/fp-ts/modules/ReadonlyArray.ts.html#size).
- Short-circuit `both` and `either` if the first predicate fails.
- Bump minimum supported fp-ts version to 2.11.0.

## 0.10.1 (2021-07-01)

- Widen the type of the first parameter in `replaceAll`.

## 0.10.0 (2021-04-16)

- Add `ReadonlyArray` and `ReadonlyRecord` modules.
- Add `fromString`, `fromStringWithRadix`, and `floatFromString` to `Number`.
- Remove `empty`, `isEmpty`, and `length` from `String` as they're superceded by the new [fp-ts/string](https://gcanti.github.io/fp-ts/modules/string.ts.html) module.
- Remove `length` from `Array` as it's superceded by [fp-ts/Array::size](https://gcanti.github.io/fp-ts/modules/Array.ts.html#size).

## 0.9.0 (2021-03-15)

- Add `Env` module with `getParam` and `getParamNonEmpty`.
- Add `minimum`, `maximum`, and `concat` to `Array`.
- Narrow the return type of `parse`.
- Throw the value that does exist in the `Either` in `unsafeUnwrap` and `unsafeUnwrapLeft`.

## 0.8.0 (2021-01-20)

- Add `reduceWhile` and `reduceRightWhile` to `Array`.
- Add missing re-exports to index module (`Debug`, `IO`).

## 0.7.0 (2020-11-29)

- Add `IO` module with `tap` and `once`.
- Add `aperture`, `slice`, `reject`, `none`, `startsWith`, `moveFrom`, `moveTo`, `countBy`, `dropRightWhile`, `mean`, `median`, `dropAt`, `transpose`, `takeRightWhile`, and `symmetricDifference` to `Array`.
- Add `reject`, `merge`, `invertLast`, and `invertAll` to `Record`.
- Add `last`, `init`, `slice`, `lookup`, `toUpper`, `toLower`, `dropRightWhile`, `under`, `replace`, `replaceAll`, `takeLeftWhile`, and `takeRightWhile` to `String`.
- Add `isValid`, `rem`, `mod`, and `negate` to `Number`.
- Add `construct`, `memoize`, `curry2` through `curry5`, `curry2T` through `curry5T`, and `uncurry2` through `uncurry5` to `Function`.
- Add `Milliseconds` newtype to `Date`, and update the `Date` and `Task` modules to universally utilise it.
- Remove `all` from `Array` as it's superceded by [fp-ts/Array::every](https://gcanti.github.io/fp-ts/modules/Array.ts.html#every).
- Remove `any` from `Array` as it's superceded by [fp-ts/Array::some](https://gcanti.github.io/fp-ts/modules/Array.ts.html#some).
- Provide the input value to the fallback function of `guard`.
- Loosen the input type of `sum` and `product` such that it needn't be readonly.
- Bump minimum supported fp-ts version to 2.9.0.

## 0.6.0 (2020-11-20)

- Add `dropRepeats`, `endsWith`, `without`, `cartesian`, `sum`, and `product` to `Array`.
- Add `dropLeft`, `dropLeftWhile`, `dropRight`, `head`, and `tail` to `String`.
- Add `empty` to `String`.
- Add `unJSONString` to `JSON`.
- Add `unary`, `applyTo`, `guard`, `ifElse`, `unless`, `when`, and `until` to `Function`.
- Remove `concat` from `String` as it's a duplicate of `prepend`.

## 0.5.2 (2020-11-02)

- Relicense under MIT.

## 0.5.1 (2020-10-30)

- Make `omit` in `Record` more permissive. It will now typecheck if you try to omit keys which aren't present in the target object.
- Drop the `lib/` prefix from imports.
- Add an optional "main" entrypoint which re-exports all modules.

## 0.5.0 (2020-10-29)

- Add `JSONString` newtype to `JSON`, and update various functions in this module accordingly. This adds `newtype-ts` and `monocle-ts` as peer dependencies.
- Add `insertMany` to `Array`.
- Add `withIndex` to `Function`.
- Add `elapsed` to `Task`.
- Add `both` and `either` to `Boolean`.
- Add `unsafeUnwrapLeft` to `Either`.
- Replace `exec` in `String` with `matchAll`.
- Remove `contains` from `Array` as it's a duplicate of `elem` in fp-ts.
- Rename `containsFlipped` in `Array` to `elemFlipped` for consistency with fp-ts.
- Remove `getInvertedOrd` from `Ord` (removing the `Ord` module entirely) as it's a duplicate of `getDualOrd` in fp-ts.

## 0.4.0 (2020-10-21)

- Add the `invert`, `and`, `or`, `xor`, `allPass`, and `anyPass` to `Boolean`.
- Remove `not` from `Boolean` as it's a duplicate of an fp-ts function.
- Remove `unsafeExactKeys` from `Record` as it's a duplicate of `keys` in fp-ts.
- Update `unsurround` in `String` to be consistent with `surround`.
- Fix `stringify`/`stringifyO` not adhering to the function signature if supplied `undefined` input.

## 0.3.0 (2020-10-20)

- Add `startsWith`, `endsWith`, `takeLeft`, `takeRight`, and `reverse` to `String`.
- Remove unneeded `newtype-ts` peer dependency. This may be added back in the future if and when we are actively utilising it.
- Upgrade `upsert` in `Array` to return a `NonEmptyArray`.
- Remove `undefined` as acceptable input to `stringifyPrimitive` in `JSON`.

## 0.2.0 (2020-10-19)

- Add `Debug` module.
- Add `URLSearchParams` module.
- Add more arithmetic to `Number`.
- Add `exec` to `String`.

## 0.1.2 (2020-10-19)

- Fix broken `getParam` type signature. It was incorrectly marked as effectful.
- Fix broken `setParam` definition. It previously mistakenly mutated its input.

## 0.1.1 (2020-10-19)

- Fix broken `unlines` definition.
- Amend `surround` to only take a single argument describing the "surroundings".

## 0.1.0 (2020-10-19)

- Initial release.
