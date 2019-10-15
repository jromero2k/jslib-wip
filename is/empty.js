"use strict" // @flow

function emptyValue(value: any): boolean {
  return value == null || value === "";
}

function emptyObject(value: any): boolean {
  for( const key in value ) {
    if( [].hasOwnProperty.call(value, key) ) return false;
  }
  return true;
}

function emptyArray(value: any): boolean {
  return value == null || value.length === 0;
}

export {
  emptyValue,
  emptyObject,
  emptyArray,
};
