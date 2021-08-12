# Changelog

This project adheres to semantic versioning.

## 0.12.0 (_Unreleased_)

- Add `converge`, `invoke`, and `invokeOn` functions to the `Function` module.
- Duplicate `filterA` from fp-ts-contrib.

## 0.11.0 (2021-08-09)

- Add `isAlpha`, `isAlphaNum`, `isLower`, `isUpper`, and `splitAt` functions to the `String` module.
- Add `zipAll` function to the `Array` and `ReadonlyArray` modules.
- Add `fork` function to the `Function` module.
- A few function signatures now use readonly arrays as opposed to regular arrays as a result of the following supercessions.
- Remove `contains`, `endsWith`, `isString`, `replace`, `slice`, `split`, `startsWith`, `toLower`, `toUpper`, `trim`, `trimLeft`, and `trimRight` from the String module as they've been superceded by new additions to [fp-ts/string](https://gcanti.github.io/fp-ts/modules/string.ts.html).
- Remove `applyTo` from the `Function` module as it's superceded by [fp-ts/function::apply](https://gcanti.github.io/fp-ts/modules/function.ts.html#apply).
- Remove `concat` from the `Array` and `ReadonlyArray` modules as it's superceded by [fp-ts/Array::concat](https://gcanti.github.io/fp-ts/modules/Array.ts.html#concat)/[fp-ts/ReadonlyArray::concat](https://gcanti.github.io/fp-ts/modules/ReadonlyArray.ts.html#concat).
- Remove `length` from the `ReadonlyArray` module as it's superceded by [fp-ts/ReadonlyArray::size](https://gcanti.github.io/fp-ts/modules/ReadonlyArray.ts.html#size).
- Short-circuit `both` and `either` if the first predicate fails.
- Bump minimum supported fp-ts version to 2.11.0.

## 0.10.1 (2021-07-01)

- Widen the type of the first parameter in `replaceAll`.

## 0.10.0 (2021-04-16)

- Add `ReadonlyArray` and `ReadonlyRecord` modules.
- Add `fromString`, `fromStringWithRadix`, and `floatFromString` functions to the `Number` module.
- Remove `empty`, `isEmpty`, and `length` from the `String` module as they're superceded by the new [fp-ts/string](https://gcanti.github.io/fp-ts/modules/string.ts.html) module.
- Remove `length` from the `Array` module as it's superceded by [fp-ts/Array::size](https://gcanti.github.io/fp-ts/modules/Array.ts.html#size).

## 0.9.0 (2021-03-15)

- Add `Env` module with `getParam` and `getParamNonEmpty` functions.
- Add `minimum`, `maximum`, and `concat` functions to the `Array` module.
- Narrow the return type of `parse`.
- Throw the value that does exist in the `Either` in `unsafeUnwrap` and `unsafeUnwrapLeft`.

## 0.8.0 (2021-01-20)

- Add `reduceWhile` and `reduceRightWhile` functions to the `Array` module.
- Add missing re-exports to index module (`Debug`, `IO`).

## 0.7.0 (2020-11-29)

- Add `IO` module with `tap` and `once` functions.
- Add `aperture`, `slice`, `reject`, `none`, `startsWith`, `moveFrom`, `moveTo`, `countBy`, `dropRightWhile`, `mean`, `median`, `dropAt`, `transpose`, `takeRightWhile`, and `symmetricDifference` functions to the `Array` module.
- Add `reject`, `merge`, `invertLast`, and `invertAll` functions to the `Record` module.
- Add `last`, `init`, `slice`, `lookup`, `toUpper`, `toLower`, `dropRightWhile`, `under`, `replace`, `replaceAll`, `takeLeftWhile`, and `takeRightWhile` functions to the `String` module.
- Add `isValid`, `rem`, `mod`, and `negate` functions to the `Number` module.
- Add `construct`, `memoize`, `curry2` through `curry5`, `curry2T` through `curry5T`, and `uncurry2` through `uncurry5` functions to the `Function` module.
- Add `Milliseconds` newtype to the `Date` module, and update the `Date` and `Task` modules to universally utilise it.
- Remove `all` from the `Array` module as it's superceded by [fp-ts/Array::every](https://gcanti.github.io/fp-ts/modules/Array.ts.html#every).
- Remove `any` from the `Array` module as it's superceded by [fp-ts/Array::some](https://gcanti.github.io/fp-ts/modules/Array.ts.html#some).
- Provide the input value to the fallback function of `guard`.
- Loosen the input type of `sum` and `product` such that it needn't be readonly.
- Bump minimum supported fp-ts version to 2.9.0.

## 0.6.0 (2020-11-20)

- Add `dropRepeats`, `endsWith`, `without`, `cartesian`, `sum`, and `product` functions to the `Array` module.
- Add `dropLeft`, `dropLeftWhile`, `dropRight`, `head`, and `tail` functions to the `String` module.
- Add `empty` constant to the `String` module.
- Add `unJSONString` function to the `JSON` module.
- Add `unary`, `applyTo`, `guard`, `ifElse`, `unless`, `when`, and `until` functions to the `Function` module.
- Remove `concat` function from the `String` module as it's a duplicate of `prepend`.

## 0.5.2 (2020-11-02)

- Relicense under MIT.

## 0.5.1 (2020-10-30)

- Make the `omit` function in the `Record` module more permissive. It will now typecheck if you try to omit keys which aren't present in the target object.
- Drop the `lib/` prefix from imports.
- Add an optional "main" entrypoint which re-exports all modules.

## 0.5.0 (2020-10-29)

- Add `JSONString` newtype to the `JSON` module, and update various functions in this module accordingly. This adds `newtype-ts` and `monocle-ts` as peer dependencies.
- Add `insertMany` function to the `Array` module.
- Add `withIndex` function to the `Function` module.
- Add `elapsed` function to the `Task` module.
- Add `both` and `either` functions to the `Boolean` module.
- Add `unsafeUnwrapLeft` function to the `Either` module.
- Replace `exec` in the `String` module with `matchAll`.
- Remove `contains` from the `Array` module as it's a duplicate of `elem` in fp-ts.
- Rename `containsFlipped` in the `Array` module to `elemFlipped` for consistency with fp-ts.
- Remove `getInvertedOrd` from `Ord` module (removing the `Ord` module entirely) as it's a duplicate of `getDualOrd` in fp-ts.

## 0.4.0 (2020-10-21)

- Add the `invert`, `and`, `or`, `xor`, `allPass`, and `anyPass` functions to the `Boolean` module.
- Remove the `not` function in the `Boolean` module as it's a duplicate of an fp-ts function.
- Remove `unsafeExactKeys` function from the `Record` module as it's a duplicate of `keys` in fp-ts.
- Update `unsurround` function in the `String` module to be consistent with the `surround` function.
- Fix `stringify`/`stringifyO` not adhering to the function signature if supplied `undefined` input.

## 0.3.0 (2020-10-20)

- Add `startsWith`, `endsWith`, `takeLeft`, `takeRight`, and `reverse` functions to the `String` module.
- Remove unneeded `newtype-ts` peer dependency. This may be added back in the future if and when we are actively utilising it.
- Upgrade `upsert` function in the `Array` module to return a `NonEmptyArray`.
- Remove `undefined` as acceptable input to `stringifyPrimitive` function in the `JSON` module.

## 0.2.0 (2020-10-19)

- Add `Debug` module.
- Add `URLSearchParams` module.
- Add more arithmetic functions to the `Number` module.
- Add `exec` function to the `String` module.

## 0.1.2 (2020-10-19)

- Fix broken `getParam` type signature. It was incorrectly marked as effectful.
- Fix broken `setParam` definition. It previously mistakenly mutated its input.

## 0.1.1 (2020-10-19)

- Fix broken `unlines` definition.
- Amend `surround` to only take a single argument describing the "surroundings".

## 0.1.0 (2020-10-19)

- Initial release.
