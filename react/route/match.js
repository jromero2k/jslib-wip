"use strict" // @flow

import Regexp from "path-to-regexp"
import location from "./location"

/// Checks if `route` matches `path` and all expected params found

function match( route: string, path?: string): boolean {
  let params = {}
  return !!fill( path, route, params ) && params // Match the route but only if all expected params found
}

/// Checks if `route` matches `path` and all expected params found.

function matchAndParams( path?: string, route: string, params?: Object ): ?any[] {
  let result
  const keys = []
    //console.log( "::Route.fill", "path=", path, "route=", route, "params=", params );

  if( !path ) { // FIXME
    path = ( route[0] === '#' )
              ? location.hash
              : location.pathname
  }

  route = route
            .replace(/\?/g, '\\?')
            .replace(/\(/g, '(?:')
  //if(route.includes("(?:")) console.log( "route=", route )

  const regexp = Regexp(route, keys, {end: false})
  //if(route.includes("(?:")) console.log( "regexp=", regexp, "keys=", keys )

  result = regexp.exec(path)
  if (!result) return;

  if( params ) {
    console.assert( typeof params === "object", "Invalid type for `params`" )

    for( let i = 1, len = result.length; i < len; ++i ) {
      const key = keys[i - 1]
      let val = ( typeof result[i] === "string" ) ? decodeURIComponent( regexResult[i] )
                                                  : result[i]
      if( val ) val = val.replace(/[?/\\]+/,"") //!!
      if( key ) params[key.name] = val
    }
    //console.log( "params=", params );
  }
  return result;
}

function parse(path?: string, params: Object) {
  const regex = /^.+=./
}


export {
  match,
  matchAndParams,
  parse
};

