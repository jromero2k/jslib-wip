"use strict" // @flow

import { stringify } from "gracias/json" // Needed to avoid errors on cycles

function toString(value?: any): string {
  switch( typeof value ) {
    case "function":
      return String(value).split(/\)\s*\{/)[0] + "){...}";
    case "object":
      if( value !== null ) return stringify(value);
    case "string":
      return '"' + String(value) + '"';
    default:
      return String(value);
  }
}

// Usage: vars`So, ${this} and ${{that}}`
//           // ~> should output `So, "thisValue" and that="thatValue"` (Notice the `${{that}}` shortcut instead of `"that"=${that}`
function vars( strs: string[], ...args: any[] ): string {
  let result = strs[0]
  for( const [i, arg]: [integer, any] of args.entries() ) {
    if( arg === null || typeof arg !== "object" ) {
      result += String(arg)
    } else {
      let firstKey = true
      for( const [k, v] of Object.entries(arg) ) {
        const thisPair = k + "=" + toString(v)
        //console.log( k, v, toString(v), thisPair )
        result += (!firstKey && ", " || "") + thisPair
        firstKey = false
      }
    }
    result += strs[i + 1]
  }
  return result;
}

function varlog( strs: string[], ...args: any[] ): void {
  console.log( vars(strs, ...args) )
}
function varwarn( strs: string[], ...args: any[] ): void {
  console.warn( vars(strs, ...args) )
}
function vardump( strs: string[], ...args: any[] ): void {
  console.error( vars(strs, ...args) )
}

console.doCollapsed = function doCollapsed( options = {}, ...params: any[] ): void {
  const { name = "", callback = null } = options

  console.groupCollapsed( name )
  try {
    if( callback ) callback(...params);
  } finally {
    console.groupEnd()
  }
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
console.logCollapsed = function logCollapsed( ...params: any[] ): void {
  console.doCollapsed( { name: params[0], callback: _ => console.log( ...params ) } )
}
console.warnCollapsed = function warnCollapsed( ...params: any[] ): void {
  console.doCollapsed( { name: params[0], callback: _ => console.warn( ...params ) } )
}
console.errorCollapsed = function errorCollapsed( ...params: any[] ): void {
  console.doCollapsed( { name: params[0], callback: _ => console.error( ...params ) } )
}
Object.assign( global, { vars, vardump, varwarn, varlog } )

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export {
  toString,
  vars,
  varlog, varwarn, vardump,
};
