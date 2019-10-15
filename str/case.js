"use strict" // @flow

import camelCase from "lodash/camelCase"
import startCase from "lodash/startCase"
import kebabCase from "lodash/kebabCase"

function prettyCase( fieldName: string ) { // Converts "path.fieldName" to "PathFieldName"
  return startCase( fieldName ).replace(/[. ]/g,"");
}

export {
  camelCase,
  startCase,
  kebabCase,
  prettyCase, // TODO Find a better name ;)
}
