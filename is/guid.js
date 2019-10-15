"use strict" // @flow

import regexGUID from "gracias/regex/guid"

function isGUID(value: string): boolean {
  console.assert( typeof value === "string", "" )
  return !!value.match( regexGUID );
}

export {
  isGUID,
};
