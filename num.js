"use strict" // @flow

function isNumberable( num: any ): boolean {
  return typeof num === "number" || typeof num.valueOf() === "number";
}

function sortAsc( a: number, b: number ): number {
  console.assert( isNumberable(a), "" );
  console.assert( isNumberable(b), "" );

  return a - b;
}
function sortDesc( a: number, b: number ): number {
  console.assert( isNumberable(a), "" );
  console.assert( isNumberable(b), "" );

  return b - a;
}

function Int32( num: number ): integer { return num >> 0; }
function Uint32( num: number ): integer { return num >>> 0; }

function divmod( num: number, divisor: number ): number {
  var div = (num / divisor) >> 0,
      mod = num - div * divisor;
  return { div, mod };
}
function inRange(num: number, from?: number, to?: number) : boolean {
  return num >= from && num <= to;
}

function lpad2(num: number): string { return ( "0" + num ).slice(-2); }
function rpad2(num: number): string { return ( num + "0" ).slice(0,2); }

function slice( num: number, startIndex: integer, endIndex: integer ): number {
  return Number( num.toString().slice( startIndex, endIndex ) ); //!!
}

function random( from?: number, to?: number ) { // Returns a random number within the specified [from..to] range
  switch( arguments.length ) {
    case 0 : from = 0; to = Number.MAX_SAFE_INTEGER; break;
    case 1 : from = 0; to = arguments[0];
  }
  return Math.floor( from + Math.random() * ( to - from + 1 ) );
}

function monkeyPatch() { // Monkey-patch Number + etc
  Object.assign( Number.prototype, {
     //
  } )

  return exports;
}

const Num = {
  monkeyPatch,

  sortAsc, sortDesc,
  isNumberable, inRange,
  Int32, Uint32,
  lpad2, rpad2,
  divmod,
  slice,
  random,
}

export {
  Num,
  sortAsc, sortDesc,
}
