"use strict" // @flow

import { Num } from "./num"

function asArray( value: ?any[] | any ): any[] {
  if( value == null ) return [];
  if( !Array.isArray(value) ) return [value];
  return value;
}
function asFilteredArray( value: any, filter: FnFilter ): any[] {
  let result = asArray(value)
  if( filter ) result = result.filter( filter )
  return result;
}

const LIST_SPLITTERS = {
  "fields": (
      list => list
                .replace( /[,;+\/|\n\r\s]+/g, " " )
                .split(" ")
                .filter( field => field.trim() )
  ),
  "lines": (
      list => list
                .split(/[\n\r]+/)
                .filter( line => line.trim() )
  ),
}
type SplitMethod = $Keys<LIST_SPLITTERS>

function toArray( list?: Function|string|any[]|any, how : SplitMethod = "fields" ): any[] {
  if( list == null ) return [];
  if( typeof list === "function" ) list = list()
  if( typeof list === "string" ) {
    console.assert( how in LIST_SPLITTERS )
    return LIST_SPLITTERS[how](list);
  }
  if( !Array.isArray(list) ) return [list];
  return list;
}

function flatten( [first, ...rest]: any[] = [] ): any[] {
  if( first === undefined ) {
    return [];
  }
  if( !Array.isArray(first) ) {
    return [ first, ...flatten(rest) ];
  }
  return [ ...flatten(first), ...flatten(rest) ];
}

function arr_has( items: any[] ): boolean {
  console.assert( Array.isArray(this) );
  if( !Array.isArray(items) ) {
    //return this.indexOf(item) >= 0;
  }
  //return item === arr;
}
function arr_randomIndex(): integer { // Returns a random index for the specified array
  console.assert( Array.isArray(this) );
  return Num.random( 0, this.length - 1 );
}
function arr_random(): any { // Returns a random item from the specified array
  console.assert( Array.isArray(this) );
  return this[Num.random( 0, this.length - 1 )];
}
function arr_first(): any {
  console.assert( Array.isArray(this) );
  return this[0];
}
function arr_last(): any {
  console.assert( Array.isArray(this) );
  return this[this.length - 1];
}
function arr_isEmpty(): boolean {
  console.assert( Array.isArray(this) );
  return this.length === 0;
}
function arr_partition( filter: FnArrayFilter ): any[] {
  console.assert( Array.isArray(this) )
  console.assert( typeof(filter) === "function" )

  let target: any[]
  const selected = [], rest = []
  for( let i = 0, len = this.length; i < len; i++ ) {
    target = filter( this[i], i ) ? selected : rest
    target.push( this[i] )
  }
  return { selected, rest };
}

function has( arr: any[], item: any ): boolean {
  if( Array.isArray(arr) ) {
    return arr.indexOf(item) >= 0;
  }
  return item === arr;
}

function randomIndex( arr : any[] ): integer { // Returns a random index for the specified array
  return Num.random( 0, arr.length - 1 );
}
function randomItem( arr : any[] ): any { // Returns a random item from the specified array
  return arr[Num.random( 0, arr.length - 1 )];
}
function lastItem( arr : any[] ): any { // Returns the last item from the specified array
  return arr[arr.length - 1];
}

/* binary-search.js
 *
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Recursive implementation of binary search.
 *
 * @param aLow      Indices here and lower do not contain the needle.
 * @param aHigh     Indices here and higher do not contain the needle.
 * @param aNeedle   The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare  Function which takes two elements and returns -1, 0, or 1.
 */
function binsearchRecursive( aLow: integer, aHigh: integer, aNeedle: any, aHaystack: any[], aCompare: FnItemCompare ): any {
  // This function terminates when one of the following is true:
  // 1. We find the exact element we are looking for.
  // 2. We did not find the exact element, but we can return the index of
  //    the next closest element that is less than that element.
  // 3. We did not find the exact element, and there is no next-closest
  //    element which is less than the one we are searching for, so we
  //    return -1.
  let middle = Math.floor( (aHigh - aLow) / 2 ) + aLow,
      cmp = aCompare( aNeedle, aHaystack[middle] );

  if( cmp === 0 ) {
    return middle; // Found the element we are looking for.
  }

  if( cmp > 0 ) {
    // aHaystack[middle] is greater than our needle.
    if( aHigh - middle > 1 ) { // The element is in the upper half.
      return binsearchRecursive( middle, aHigh, aNeedle, aHaystack, aCompare );
    }
    // We did not find an exact match, return the next closest one (case 2).
    return middle;
  }

  // aHaystack[middle] is less than our needle.
  if( middle - aLow > 1 ) { // The element is in the lower half.
    return binsearchRecursive( aLow, middle, aNeedle, aHaystack, aCompare );
  }

  // The exact needle element was not found in this haystack. Determine if
  // we are in termination case (2) or (3) and return the appropriate thing.
  return aLow < 0 ? -1 : aLow;
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of next lowest value checked if there is no exact hit.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 */
function binSearch( aNeedle: any, aHaystack: any[], aCompare: FnCompare ): any {
  if( !aCompare ) aCompare = ( needle, value ) => needle - value;

  return aHaystack.length === 0
            ? -1
            : binsearchRecursive( -1, aHaystack.length, aNeedle, aHaystack, aCompare );
};

/**
 * This variant always returns -1 if the element is not found (ie, works like Array.indexOf).
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 */
function binFind( aNeedle: any, aHaystack: any[], aCompare: FnCompare ): any {
  if( !aCompare ) aCompare = ( item1, item2 ) => item1 - item2;

  return aHaystack.length === 0
            ? -1
            : binsearchRecursive( -1, aHaystack.length, aNeedle, aHaystack, aCompare );
};

function monkeyPatch(): void { // Monkey-patch Array.prototype
  //extend( Array.prototype, { //TODO
  //  //
  //} );
  Object.assign( Array, { flatten,
                        } )

  return exports;
}

export {
  monkeyPatch,

  asArray, asFilteredArray, toArray, flatten,

  has,
  randomIndex, randomItem,
  binFind,
  lastItem,
};
