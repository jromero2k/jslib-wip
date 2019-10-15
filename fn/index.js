"use strict" // @flow

function FnEmpty() {
  // Does nothing
}

function getInterface( fn: Function ) : string { // Returns `function name(args)` (for traditional functions) or `(args)` (for "fat-arrow" functions, ()s are added if missing)
  const fnDecl = fn.toString()
  console.assert( fnDecl.match(/(?:function\s|.*=>)/) )

  const fnArgs =  fnDecl.replace(/\/\*.*\*\//g, "").match(/.*\)/).trim()
}
function getArgNames( fn ) {

}
/*
module.exports = function(func) {
  // First match everything inside the function argument parens.
  var args = func.toString()*?\(([^)]*)\)/)[1];

  // Split the arguments string into an array comma delimited.
  return args.split(", ").map(function(arg) {
    // Ensure no inline comments are parsed and trim the whitespace.
    return arg;
  }).filter(function(arg) {
    // Ensure no undefineds are added.
    return arg;
  });
};
 */

function not( fn: Function ) {
  return (...args?: any[] ) => !fn(...args);
  //return function(...args) { return !fn.call(this, ...args); }
}

function unary( fn: Function ) {
  return fn.length === 1
            ? fn
            : ( singleArg: any ) => fn( singleArg ); // ie. calls fn dropping all arguments but the 1st
}

function callLeft( fn: Function, ...args: any[] ) {
  return ( ...rest?: any[] ) => fn( ...args, ...rest );
}
function callRight( fn: Function, ...args: any[] ) {
  return ( ...rest?: any[] ) => fn( ...rest, ...args );
}

export {
  FnEmpty,

  unary,
  not,
  callLeft, callRight,

  getArgNames,
}
