"use module" // @flow

import { toArray } from "./array"

const PROPERTIED_TYPES = {
  "object": "object",
  "function": "function",
  "array": "array",
}

function isObject( value: any ) : boolean { /// `typeof value === "object"` but with null fixed
  return typeof value === "object" && value !== null;
}
function canKey( value: any ) : boolean { /// Returns true if {value} is object or function (ie, can have keys+values)
  return typeof value in PROPERTIED_TYPES && value !== null; // variant: `value === Object(value)`
}

function map( obj: any, _map: (k: any, v: any) => [/*outKey:*/any, /*outValue:*/any], _this?: any ): Object {
  let result = {}
  for( const [k,v] of Object.entries(obj) ) {
    const mapped = _map(k,v)
    if( mapped ) {
      console.assert( Array.isArray(mapped), "The callback should return a tuple: `[key, value]`" )
      console.assert( mapped.length == 2, "The callback should return a tuple: `[key, value]`" )
      const [key, value] = mapped
      result[key] = value
    }
  }
  return result;
}
/*
  NOTE: You'll probably want to use `objNew( Proto, objCopy(objIntf), Props );`
 */
function objNew( objProto: Object, objIntf: Object, objProps: Object ) : Object {
  let result = Object.create( objProto, objProps )
  if( objIntf ) deepAssign( result, objIntf )
  return result;
}

function objCopy( ...sources: Object[] ) : Object { // Returns a new copy of the spcecified source(s)
  let result

  for( const source of sources ) {
    switch( Object.classof(source) ) {
      case 'Array' :
        result = [] //!!
        break;
      case 'Object' :
        if( result === undefined ) result = {};
        break;
      default:
        result = source
        continue;
    }
    for( const key of Object.keys(source) ) {
      result[key] = objCopy( source[key] )
    }
  }
  return result;
}

function copy( source: Object, whitelist: string|Object|any[] ) : Object {
  switch( Object.classof(whitelist) ) {
    case "String":
      whitelist = toArray(whitelist)
      break;
    case "Object":
      whitelist = Object.keys(whitelist)
    case "Array":
      break;
    default:
      console.assert( false, "{whitelist} must array, object or string!" )
  }
  console.assert( Object.isObject(obj), "{target} must be an object" )
  console.assert( whitelist.length > 0 && whitelist[0] !== "", "{whitelist} must not be empty!" )

  let result = {}
  for( const key of whitelist ) {
    if( key != "" ) result[key] = source[key]
  }
  return result;
}

function onlyAssign( whitelist: string|any[], target: Object, ...sources: Object[] ) : Object { // Replaces target[keys] with sources[keys] but only for keys in {whitelist} (from right to left)
  console.assert( canKey(target), "{target} must be an object or function!" )
  console.assert( whitelist != null, "{whitelist} must not be empty!" )

  if( typeof whitelist === "string" ) whitelist = toArray(whitelist);
  console.assert( Array.isArray(whitelist) );

  for( const source of sources ) {
    for( const key of Object.keys(source) ) {
      if( whitelist.includes(key) ) {
        target[key] = source[key]
      }
    }
  }
  return target;
}

function extend( target: Object, ...sources: Object[] ) : Object { // Extends target[*] with source[*] (eg, only adds new values)
  console.assert( canKey(target), "{target} must be an object or function!" )

  for( const source of sources ) {
    for( const [key, value] of Object.entries(source) ) {
      if( typeof target[key] === "undefined" && typeof value !== "undefined" ) {
        target[key] = value
      }
    }
  }
  return target;
}

function deepExtend( target: Object, ...sources: Object[] ) : Object { // Extends target[*] with source[*] (eg, only adds new values)
  console.assert( canKey(target), "{target} must be an object or function!" )

  for( const source of sources ) {
    for( const [key, value] of Object.entries(source) ) {
      if( typeof value !== "undefined" ) {
        if( typeof target[key] === "undefined" ) {
          target[key] = value
        } else {
          if( Object.isObject(value) ) deepExtend( target[key], value );
        }
      }
    }
  }
  return target;
}

function assign( target: Object, ...sources: Object[] ) : Object { // Replaces target[*] with sources[*] (from right to left)
  console.assert( canKey(target), "{target} must be an object or function!" )

  for( const source of sources ) {
    for( const key of Object.keys(source) ) {
      target[key] = source[key];
    }
  }
  return target;
}

function deepAssign( target: Object, ...sources: Object[] ) : Object { // Replaces target[*] with sources[*] (from right to left)
  console.assert( canKey(target), "{target} must be an object or function!" )

  for( const source of sources ) {
    for( const [key, value] of Object.entries(source) ) {
      if( Object.isObject( value ) && Object.isObject( target[key] ) ) {
        deepAssign( target[key], value )
      } else {
        target[key] = value
      }
    }
  }
  return target;
}

function has( obj: Object, key: any ) : boolean {
  return {}.hasOwnProperty.call( obj, key );
}
function missingKeys( obj: Object, source: Object ) : any[] { /// Returns which properties from source are missing in obj
  console.assert( canKey(obj), "Argument must be an object or function" );
  console.assert( canKey(source), "Argument must be an object or function" );

  const result = []
  for( const key of Object.keys(source) ) {
    if( !has(obj, key) ) result.push( key );
  }
  return result;
}
function keyCount( obj: any ) : integer {
  console.assert( canKey(obj), "Argument must be an object or function" )

  let result = 0
  for( const key of Object.keys(obj) ) {
    result++
  }
  return result;
}
function toObject( list: string ): Object {
  list = toArray(list)
  const result = {}
  for( const key of list ) {
    result[key] = 1
  }
  return result;
}

/*
function objDiff( target, source ) { // Returns target[*] diffs from source[*] (eg, only differing values)
  console.assert( canKey(obj), "Argument must be an object or function" );

  let result = {}, targetValue, sourceValue;

  for( const key in source ) {
    sourceValue = source[key];
    targetValue = target[key];
    if( targetValue !== sourceValue ) {
      result[ key ] = targetValue;
    }
  }
  for( const key in target ) {
    //!!
  }
  return result;
}
*/

export {
  isObject, canKey, toObject,
  has, keyCount, missingKeys,
  map,
  copy,
  extend, deepExtend,
  assign, deepAssign,
  onlyAssign,
  objNew,
}

// TODO
//
// objNull( propList ) ~> eg, `objNull("a,b")` returns `{ a: null, b: null }`
// objUndf( propList ) ~> eg, `objUndf("a,b")` returns `{ a: undefined, b: undefined }`
// obj( propList, value ) ~> eg, `obj("a,b", -1)` returns `{ a: -1, b: -1 }`
// props( propList ) ~> eg, `props("a,b")` returns `{ a:1, b:1 }`. Useful for `if( prop in props("a|b") )`
