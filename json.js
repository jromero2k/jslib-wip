"use strict";

function decyclingVisitor(fn) { // Replaces cycles before calling fn
  const keys = [],
        values = [];
  return function cycleChecker(key, value) { // this ~> the object we're stringifying
    if( values.length === 0 ) {
      values.push(value);
    } else {
      if( values.length > 256 ) return "Stopped at " + keys.join(".");

      const pos = values.indexOf(this);
      if( ~pos ) { keys.splice(pos, Infinity, key); values.splice(pos + 1); }
      else       { keys.push(key);                  values.push(this);      };

      if( ~values.indexOf(value) ) value = decycler(key, value);
    }
    if(fn) return fn.call(this, key, value);
    return value;
  }

  function decycler(key, value) {
    return ( values[0] === value )
             ? "[Cycle ~]"
             : "[Cycle ~."+ keys.slice( 0, values.indexOf(value) ).join(".") +"]";
  }
}

function stringify(obj, replacer, spaces) {
  return JSON.stringify(obj, decyclingVisitor(replacer), spaces);
}

export {
  stringify,
};
