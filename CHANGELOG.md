# Changelog

This project adheres to semantic versioning.

## _Unreleased_

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

