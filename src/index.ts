/**
 * All modules re-exported in a single primary entrypoint.
 *
 * @since 0.5.1
 */

import * as array from "./Array"
import * as boolean from "./Boolean"
import * as date from "./Date"
import * as debug from "./Debug"
import * as either from "./Either"
import * as function_ from "./Function"
import * as io from "./IO"
import * as json from "./JSON"
import * as number from "./Number"
import * as option from "./Option"
import * as record from "./Record"
import * as string from "./String"
import * as task from "./Task"
import * as url from "./URL"
import * as urlSearchParams from "./URLSearchParams"

export {
  /**
   * @since 0.5.1
   */
  array,
  /**
   * @since 0.5.1
   */
  boolean,
  /**
   * @since 0.5.1
   */
  date,
  /**
   * @since 0.8.0
   */
  debug,
  /**
   * @since 0.5.1
   */
  either,
  /**
   * @since 0.5.1
   */
  function_ as function,
  /**
   * @since 0.8.0
   */
  io,
  /**
   * @since 0.5.1
   */
  json,
  /**
   * @since 0.5.1
   */
  number,
  /**
   * @since 0.5.1
   */
  option,
  /**
   * @since 0.5.1
   */
  record,
  /**
   * @since 0.5.1
   */
  string,
  /**
   * @since 0.5.1
   */
  task,
  /**
   * @since 0.5.1
   */
  url,
  /**
   * @since 0.5.1
   */
  urlSearchParams,
}
