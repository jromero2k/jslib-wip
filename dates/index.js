"use strict" // @flow

export * from "./datetime"
export * from "./date8"

// TODO This is not working properly, Date8 & DateTime are exported as objects, not functions
// TODO Find out if a polyfill incompatibility or working as designed?

import { DateTime } from "./datetime"
import { Date8 } from "./date8"

export {
  DateTime, //...DateTime,
  Date8, //...Date8,
};
