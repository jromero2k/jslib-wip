"use strict" // @flow

function orNull( ...args: any[] ) {
  for( let i = 0, len = args.length; i < len; i++ ) {
    if( args[i] != null ) return args[i];
  }
  return null;
}

function orUndefined( ...args: any[] ) {
  for( let i = 0, len = args.length; i < len; i++ ) {
    if( args[i] != null ) return args[i];
  }
  return undefined;
}

function orDefault( defaultValue: any, ...args: any[] ) { // Returns any defined argument, or default.
                                              // NOTE: If default is a function, returns the function's result
  for( let i = 0, len = args.length; i < len; i++ ) {
    if( args[i] !== undefined ) return args[i];
  }
  return (typeof defaultValue === "function")
             ? defaultValue()
             : defaultValue;
}

export {
  orNull, orUndefined, orDefault,
};
