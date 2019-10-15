"use module" // @flow

function NopIterator(): Iterator {
  return {
    next() { return { done: true } },
    [Symbol.iterator]() { return this; }
  }
}

function take( n: integer, iterable: Iterable ): Iterator {
  let iter = iterable[Symbol.iterator]();

  return {
    next() {
      if( n > 0 ) {
        n--;
        return iter.next();
      }
      iter.return && iter.return();
      return { done : true };
    },
    return() {
      n = 0;
      iter.return && iter.return();
    },
    [Symbol.iterator]() { return this; }
  };
}

function filter( iterable: Iterable, fn: Function ): Iterator { // Returns a new iterator that ignores steps for which fn(value) returns false

}

function* map(iterable: Iterable, fn: Function ): Iterator {
  for( const value of iterable ) yield fn(value);
}
//function map( iterable, fn ) { // Returns a new iterator that returns fn(value) for each step
//  let iter = iterable[Symbol.iterator]();
//
//  return {
//    next() {
//      result = iter.next();
//      //...
//      iter.return && iter.return();
//      return { done : true };
//    },
//    return() {
//      //...
//      iter.return && iter.return();
//    },
//    [Symbol.iterator]() { return this; }
//  };
//}
function reduce( iterable, fn, initialValue ) {
  // function fn(previousValue, value)
}

function every( iterable: Iterable, fn: Function ): boolean { // Calls fn(value) for each step, stops once it returns false
  for( const value of iterable ) if( !fn(value) ) {
    return false;
  }
  return true;
}
function some( iterable: Iterable, fn: Function ): boolean { // Calls fn(value) for each step, stops once it returns true
  for( const value of iterable ) if( fn(value) ) {
    return true;
  }
}

function partition( iterable: Iterable, filter: Function ) { // Returns { selected: [], rejected: [rejected] }

}

function zip( ...iterables: Iterable[] ): Iterator { // Takes n iterables, returns a single iterable that returns an array of n values
  let done = false,
      iterators = iterables.map( iter => iter[Symbol.iterator]() );
  return {
    next() {
      if( !done ) {
        let items = iterators.map( iter => iter.next() );

        done = items.some( item => item.done );
        if( !done ) {
          return { value : items.map( i => i.value ) };
        }

        for( let iterator of iterators ) {
          iterator.return && iterator.return();
        }
      }
      return { done : true };
    },
    [Symbol.iterator]() { return this; }
  }
}

export {
  NopIterator,
  filter,
  partition,
  map,
  reduce,
  take,
  every,
  some,
  zip,
};
