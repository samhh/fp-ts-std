/**
 * All modules re-exported in a single primary entrypoint.
 *
 * @since 0.5.1
 */

import * as alternative from "./Alternative"
import * as applicative from "./Applicative"
import * as array from "./Array"
import * as bifunctor from "./Bifunctor"
import * as boolean from "./Boolean"
import * as date from "./Date"
import * as debug from "./Debug"
import * as dom from "./DOM"
import * as either from "./Either"
import * as env from "./Env"
import * as function_ from "./Function"
import * as io from "./IO"
import * as ioEither from "./IOEither"
import * as isomorphism from "./Isomorphism"
import * as json from "./JSON"
import * as lazy from "./Lazy"
import * as monad from "./Monad"
import * as monoid from "./Monoid"
import * as newtype from "./Newtype"
import * as nonEmptyString from "./NonEmptyString"
import * as number from "./Number"
import * as option from "./Option"
import * as ordering from "./Ordering"
import * as predicate from "./Predicate"
import * as random from "./Random"
import * as reader from "./Reader"
import * as readerEither from "./ReaderEither"
import * as readerTask from "./ReaderTask"
import * as readerTaskEither from "./ReaderTaskEither"
import * as readonlyArray from "./ReadonlyArray"
import * as readonlyRecord from "./ReadonlyRecord"
import * as readonlyStruct from "./ReadonlyStruct"
import * as record from "./Record"
import * as show from "./Show"
import * as string from "./String"
import * as struct from "./Struct"
import * as task from "./Task"
import * as taskEither from "./TaskEither"
import * as taskOption from "./TaskOption"
import * as tuple from "./Tuple"
import * as url from "./URL"
import * as urlSearchParams from "./URLSearchParams"

export {
  /**
   * A re-export of the `fp-ts-std/Alternative` module.
   *
   * @since 0.13.0
   */
  alternative,
  /**
   * A re-export of the `fp-ts-std/Applicative` module.
   *
   * @since 0.12.0
   */
  applicative,
  /**
   * A re-export of the `fp-ts-std/Array` module.
   *
   * @since 0.5.1
   */
  array,
  /**
   * A re-export of the `fp-ts-std/Bifunctor` module.
   *
   * @since 0.14.0
   */
  bifunctor,
  /**
   * A re-export of the `fp-ts-std/Boolean` module.
   *
   * @since 0.5.1
   */
  boolean,
  /**
   * A re-export of the `fp-ts-std/Date` module.
   *
   * @since 0.5.1
   */
  date,
  /**
   * A re-export of the `fp-ts-std/Debug` module.
   *
   * @since 0.8.0
   */
  debug,
  /**
   * A re-export of the `fp-ts-std/DOM` module.
   *
   * @since 0.10.0
   */
  dom,
  /**
  /**
   * A re-export of the `fp-ts-std/Either` module.
   *
   * @since 0.5.1
   */
  either,
  /**
   * A re-export of the `fp-ts-std/Env` module.
   *
   * @since 0.12.0
   */
  env,
  /**
   * A re-export of the `fp-ts-std/Function` module.
   *
   * @since 0.5.1
   */
  function_ as function,
  /**
   * A re-export of the `fp-ts-std/IO` module.
   *
   * @since 0.8.0
   */
  io,
  /**
   * A re-export of the `fp-ts-std/IOEither` module.
   *
   * @since 0.15.0
   */
  ioEither,
  /**
   * A re-export of the `fp-ts-std/Isomorphism` module.
   *
   * @since 0.15.0
   */
  isomorphism,
  /**
   * A re-export of the `fp-ts-std/JSON` module.
   *
   * @since 0.5.1
   */
  json,
  /**
   * A re-export of the `fp-ts-std/Lazy` module.
   *
   * @since 0.12.0
   */
  lazy,
  /**
   * A re-export of the `fp-ts-std/Monad` module.
   *
   * @since 0.15.0
   */
  monad,
  /**
   * A re-export of the `fp-ts-std/Monoid` module.
   *
   * @since 0.12.0
   */
  monoid,
  /**
   * A re-export of the `fp-ts-std/Number` module.
   *
   * @since 0.15.0
   */
  newtype,
  /**
   * A re-export of the `fp-ts-std/NonEmptyString` module.
   *
   * @since 0.15.0
   */
  nonEmptyString,
  /**
   * A re-export of the `fp-ts-std/Number` module.
   *
   * @since 0.5.1
   */
  number,
  /**
   * A re-export of the `fp-ts-std/Option` module.
   *
   * @since 0.5.1
   */
  option,
  /**
   * A re-export of the `fp-ts-std/Ordering` module.
   *
   * @since 0.12.0
   */
  ordering,
  /**
   * A re-export of the `fp-ts-std/Predicate` module.
   *
   * @since 0.12.0
   */
  predicate,
  /**
   * A re-export of the `fp-ts-std/Random` module.
   *
   * @since 0.15.0
   */
  random,
  /**
   * A re-export of the `fp-ts-std/Reader` module.
   *
   * @since 0.15.0
   */
  reader,
  /**
   * A re-export of the `fp-ts-std/ReaderEither` module.
   *
   * @since 0.15.0
   */
  readerEither,
  /**
   * A re-export of the `fp-ts-std/ReaderTask` module.
   *
   * @since 0.15.0
   */
  readerTask,
  /**
   * A re-export of the `fp-ts-std/ReaderTaskEither` module.
   *
   * @since 0.15.0
   */
  readerTaskEither,
  /**
   * A re-export of the `fp-ts-std/ReadonlyArray` module.
   *
   * @since 0.10.0
   */
  readonlyArray,
  /**
   * A re-export of the `fp-ts-std/ReadonlyRecord` module.
   *
   * @since 0.10.0
   */
  readonlyRecord,
  /**
   * A re-export of the `fp-ts-std/ReadonlyStruct` module.
   *
   * @since 0.14.0
   */
  readonlyStruct,
  /**
   * A re-export of the `fp-ts-std/Record` module.
   *
   * @since 0.5.1
   */
  record,
  /**
   * A re-export of the `fp-ts-std/Show` module.
   *
   * @since 0.12.0
   */
  show,
  /**
   * A re-export of the `fp-ts-std/String` module.
   *
   * @since 0.5.1
   */
  string,
  /**
   * A re-export of the `fp-ts-std/Struct` module.
   *
   * @since 0.14.0
   */
  struct,
  /**
   * A re-export of the `fp-ts-std/Task` module.
   *
   * @since 0.5.1
   */
  task,
  /**
   * A re-export of the `fp-ts-std/TaskEither` module.
   *
   * @since 0.12.0
   */
  taskEither,
  /**
   * A re-export of the `fp-ts-std/TaskOption` module.
   *
   * @since 0.12.0
   */
  taskOption,
  /**
   * A re-export of the `fp-ts-std/Tuple` module.
   *
   * @since 0.12.0
   */
  tuple,
  /**
   * A re-export of the `fp-ts-std/URL` module.
   *
   * @since 0.5.1
   */
  url,
  /**
   * A re-export of the `fp-ts-std/URLSearchParams` module.
   *
   * @since 0.5.1
   */
  urlSearchParams,
}
