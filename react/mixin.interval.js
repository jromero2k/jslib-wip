"use strict"

const IntervalMixin = { // Taken from the docs

  componentWillMount() {
    this.__intervals = [];
  },
  componentWillUnmount() {
    this.__intervals.forEach( clearInterval );
  },

  setInterval(...args: any[] ) {
    this.__intervals.push( setInterval.call( undefined, ...args ) );
  },

}

export default IntervalMixin;
