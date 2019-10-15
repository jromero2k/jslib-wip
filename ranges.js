"use strict" // @flow

//console.log( "date8 loaded" );

export type AnyRange = ItemFragment | ItemRange | ItemRanges

export interface ItemFragment {
  offset : number,
  size : number,

  //constructor( what: AnyRange )
  join( what: AnyRange ): ItemRanges,
  intersect( what: AnyRange ): ItemRanges,
  subtract( what: AnyRange ): ItemRanges,
}

export interface ItemRange {
  from : number,
  to : number,

  //constructor( what: AnyRange )
  join( what: AnyRange ): ItemRanges,
  intersect( what: AnyRange ): ItemRanges,
  subtract( what: AnyRange ): ItemRanges,
}

export interface ItemRanges {
  parts : ItemRange[],

  //constructor( what: AnyRange ),
  join( what: AnyRange ): ItemRanges,
  intersect( what: AnyRange ): ItemRanges,
  subtract( what: AnyRange ): ItemRanges,
}
/*
const RangePROTO = Object.defineProperties( {}, {
        toString :  { configurable: false, writable: false, enumerable: false, value: _ => `${this.offset}..${this.size}` },
        valid :     { configurable: false, writable: false, enumerable: false, value: rangeValid },
        size :      { configurable: false, writable: false, enumerable: false, value: rangeSize },
        subtract :  { configurable: false, writable: false, enumerable: false, value: _subtract },
        intersect : { configurable: false, writable: false, enumerable: false, value: _intersect },
        join :      { configurable: false, writable: false, enumerable: false, value: _join },
        compare :   { configurable: false, writable: false, enumerable: false, value: range_compare },
} )

const RangesPROTO = Object.defineProperties( {}, {
        toString :  { configurable: false, writable: false, enumerable: false, value: rangesToString },
        valid :     { configurable: false, writable: false, enumerable: false, value: rangesValid },
//      snapTo :    { configurable: false, writable: false, enumerable: false, value: ranges_snapTo },
        subtract :  { configurable: false, writable: false, enumerable: false, value: _subtract },
        intersect : { configurable: false, writable: false, enumerable: false, value: _intersect },
        join :      { configurable: false, writable: false, enumerable: false, value: _join },
        compare :   { configurable: false, writable: false, enumerable: false, value: ranges_compare },
} )

const FragmentPROTO = Object.defineProperties( {}, {
        toString :  { configurable: false, writable: false, enumerable: false, value: _ => `${this.offset}(+${this.size})` },
        valid :     { configurable: false, writable: false, enumerable: false, value: fragValid },
        size :      { configurable: false, writable: false, enumerable: false, value: fragSize },
        subtract :  { configurable: false, writable: false, enumerable: false, value: _subtract },
        intersect : { configurable: false, writable: false, enumerable: false, value: _intersect },
        join :      { configurable: false, writable: false, enumerable: false, value: _join },
        compare :   { configurable: false, writable: false, enumerable: false, value: frag_compare },
        equal :     { configurable: false, writable: false, enumerable: false, value: frag_equal },
} )

function _join( what: AnyRange ): ItemRanges {
  let result: ItemRanges
  if( this.from ) {

  } else
  if( this.offset ) {
    return
  } else {
    console.assert( this.parts )
  }
}
function _intersect( what: AnyRange ): ItemRanges {

}
function _subtract( what: AnyRange ): ItemRanges {

}

function delta(a: any, b: any) : integer {
}

function _valueOf() : integer { return this.value; }
function _toString() : string { return String( this.value ); }
function _compare(another) : integer {
  console.assert( valid(this) )

  return this.value - _Date8(another).value;
}
function _ItemRange( value : any ): ItemRange {
  console.assert( valid(value), value + " is not a valid Date8!" )
  return Object.create( PROTO, { "value" : { value: +value, configurable : false, writable : false, enumerable : false } } );
}

const ItemRange = ( function self(): ItemRange {
} )();
*/
export {
};
