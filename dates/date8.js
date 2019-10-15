"use strict" // @flow

import { Num } from "../num"
import { DateTime } from "./datetime"
import { i18n } from "../i18n"

//console.log( "date8 loaded" );

const MaxDate8 = 99991231

const PROTO = Object.defineProperties( {}, {
  valueOf:     { configurable: false, writable: false, enumerable: false, value: _valueOf },
  toString:    { configurable: false, writable: false, enumerable: false, value: _toString },
  toJSON:      { configurable: false, writable: false, enumerable: false, value: _valueOf },
  from:        { configurable: false, writable: false, enumerable: false, value: _from },
  asDate:      { configurable: false, writable: false, enumerable: false, value: _asDate },
  valid:       { configurable: false, writable: false, enumerable: false, value: valid },
  isToday:     { configurable: false, writable: false, enumerable: false, value: _isToday },
  dayOfWeek:   { configurable: false, writable: false, enumerable: false, value: _dayOfWeek },
  date:        { configurable: false, writable: false, enumerable: false, value: _date },
  month:       { configurable: false, writable: false, enumerable: false, value: _month },
  year:        { configurable: false, writable: false, enumerable: false, value: _year },
  parse:       { configurable: false, writable: false, enumerable: false, value: parse },
  parsePadded: { configurable: false, writable: false, enumerable: false, value: parsePadded },
  snapTo:      { configurable: false, writable: false, enumerable: false, value: _snapTo },
  previous:    { configurable: false, writable: false, enumerable: false, value: previous },
  next:        { configurable: false, writable: false, enumerable: false, value: next },
  inRange:     { configurable: false, writable: false, enumerable: false, value: _inRange },
  compare:     { configurable: false, writable: false, enumerable: false, value: _compare },
  equal:       { configurable: false, writable: false, enumerable: false, value: _equal },
  delta:       { configurable: false, writable: false, enumerable: false, value: _delta },
  newRange:    { configurable: false, writable: false, enumerable: false, value: _newRange }, //!!
} )

function valid( ...args: any[] ): boolean {
  if( !args.length ) {
    return valid( this );
  } // Converts `dt8.valid()` into `Date8.valid(dt8)`
  for( const value of args ) {
    const date8 = value && value.valueOf() || 0
    console.assert( typeof date8 === "number" )
    if( date8 > MaxDate8 ) {
      return false;
    } // 99991231
    if( date8 < 101 ) {
      return false;
    } // 00000101
    if( !Num.inRange( date8 % 100, 1, 31 ) ) {
      return false;
    } // day in 1..31
    if( !Num.inRange( Math.floor( date8 / 100 ) % 100, 1, 12 ) ) {
      return false;
    } // month in 1..12
  }
  return true;
}

function valueFromISO8601( str: string ): integer {
  console.assert( str && typeof str === "string" )

  const s = (str.trim() + "0101").replace( /(\d\d\d\d)[^\d]*(\d\d)[^\d]*(\d\d).*$/, "$1$2$3" ) // 2011*03*09* ~> 20110309
  console.assert( s.length === 8 )
  return Number( s );
}

function valueFromDate( date: Date | number | string ): integer {
  console.assert( date != null )

  if( !(date instanceof Date) ) {
    date = new Date( date )
  }
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

//function fromString( str : string ) : Date8 {
//  if( /\d\d\d\d-\d\d-\d\dT?/ ) return fromISO8601(str);
//  return valueFromDate( Date(str) );
//}
function fromISO8601( str: string ): Date8 {
  return _Date8( valueFromISO8601( str ) );
}

function fromHtml( selector: string | any ): Date8 { // Extracts a Date8 from the specified HTML element (expects jQuery or API-compatible)
  /*eslint-env jquery */
  var $elem = $( selector ),
      dt = $elem.attr( "date" ) || $elem.attr( "title" )
  console.assert( selector && $elem )
  console.assert( dt )
  return fromISO8601( dt );
}

function fromWeek( weekNo: number, weekDay: number ) { // fromWeek(0, 0) = January 1, etc
  return today().snapTo( "year" ).next( "week", weekNo ).next( "day", weekDay ); //!!
}

function today(): Date8 { return _Date8( Date.now() ); }

function yesterday(): Date8 { return today().previous(); }

function tomorrow(): Date8 { return today().next(); }

function thisWeek(): Date8 {
  const _today = today()
  return _today.previous( _today.dayOfWeek() );
}

function previous( period: DatePeriod = "day", count?: number = 1 ): Date8 {
  let result: Date8,
      newValue: number,
      value: number = this.value || today()

  switch( period ) {
    case "week" :
      count *= 7 // day*7
    case "day" :
      newValue = value % 100 - count
      if( newValue > 0 ) {
        return _Date8( value - count );
      } // fast track?
      result = DateTime.fromDate8( value )
      result.setUTCDate( newValue )
      return _Date8( result );
    case "month" :
      newValue = Math.floor( value / 100 ) % 100 - count
      if( newValue > 0 ) {
        return _Date8( value - count * 100 );
      } // fast track?
      result = DateTime.fromDate8( value )
      result.setUTCMonth( newValue - 1 )
      return _Date8( result );
    case "year" :
      return _Date8( value - count * 10000 );
    default :
      console.assert( false, "Unsupported time period: `" + period + "`" )
  }
}

function next( period: DatePeriod = "day", count?: number = 1 ): Date8 {
  var result,
      newValue,
      value = this.value || today()

  switch( period ) {
    case "week" :
      count *= 7 // day*7
    case "day" :
      newValue = value % 100 + count
      if( newValue <= 28 ) {
        return _Date8( value + count );
      } // fast track?
      result = DateTime.fromDate8( value )
      result.setUTCDate( newValue )
      return _Date8( result );
    case "month" :
      newValue = Math.floor( value / 100 ) % 100 + count
      if( newValue < 12 ) {
        return _Date8( value + count * 100 );
      } // fast track?
      result = DateTime.fromDate8( value )
      result.setUTCMonth( newValue - 1 )
      return _Date8( result );
    case "year" :
      return _Date8( value + count * 10000 );
    default :
      console.assert( false, "Unsupported time period: `" + period + "`" )
  }
}

function compare( a: any, b: any ): integer {
  return _Date8( a ).value - _Date8( b ).value;
}

function delta( a: any, b: any ): integer {
  return Math.floor( (+DateTime.fromDate8( a ) - +DateTime.fromDate8( b )) / DateTime.OneDay ); //!!
}

function random( from: Date8 | integer, to: Date8 | integer ): Date8 { // Returns a random date within the specified [from..to] dates
  console.assert( valid( from, to ) )
  const _today: Date8 = today()

  switch( arguments.length ) {
    case 0 :
      from = 0;
      to = today();
      break;
    case 1 :
      if( arguments[0] > _today ) {
        from = _today;
        to = arguments[0]
      } else {
        from = arguments[0];
        to = _today
      }
  }
  return from.next( Num.random( delta( to, from ) ) );
}

function* iterator( mode: DatePeriod = "day", range: RangeRecord ) {
  console.assert( range.from.valid() && range.to.valid() )
  for( let dt = range.from; dt <= range.to; dt = dt.next( mode ) ) {
    yield dt;
  }
}

function parse( value: Date8 | integer ): DateOnlyRecord {
  if( !arguments.length ) {
    console.assert( valid( this ), "Either `Date8.parse(date8)` or `date8.parse`" )
    return parse( this );
  }
  const date8 = Number( value )
  return {
    year:  Math.floor( date8 / 10000 ),
    month: Math.floor( date8 / 100 ) % 100,
    day:   date8 % 100,
  };
}

function parsePadded( value: Date8 | integer ): {year: string, month:string, day: string} {
  const _value = value || this
  const { year, month, day, } = Date8(_value).parse()
  return {
    year:  String(year).padStart(4,"0"),
    month: String(month).padStart(2,"0"),
    day:   String(day).padStart(2,"0"),
  };
}

function _valueOf(): integer { return this.value; }

function _toString(): string { return String( this.value ); }

function _asDate(): Date { return DateTime.fromDate8( this.value ); }

function _compare( another ): integer {
  console.assert( valid( this ) )

  return this.value - _Date8( another ).value;
}

function _equal( another ): boolean {
  console.assert( valid( this ) )

  return this.value - _Date8( another ).value === 0; //!!
}

function _isToday(): boolean {
  console.assert( valid( this ) )

  return this.value - today().value === 0; //!!
}

function _inRange( range: RangeRecord ): boolean {
  console.assert( range != null )
  console.assert( valid( range.from ), "Invalid range.from: " + range.from )
  console.assert( valid( range.to ), "Invalid range.to: " + range.to )
  console.assert( valid( this ) )

  return this.value >= range.from && this.value <= range.to;
}

function _year(): integer {
  console.assert( valid( this ) );
  return Math.floor( this.value / 10000 );
}

function _month(): integer {
  console.assert( valid( this ) );
  return Math.floor( this.value / 100 ) % 100 - 1;
}

function _date(): integer {
  console.assert( valid( this ) );
  return this.value % 100;
}

function _dayOfWeek(): integer {
  console.assert( valid( this ) )

  return DateTime.fromDate8( this ).getDay(); //!!
}

function _str( strs: string[] ): string {
  console.assert( valid( this ) )
  const args = this.parse()
  // TODO
}

function _newRange( mode: DatePeriod = "day" ): RangeRecord { //!!
  var result;
  console.assert( valid( this ) )

  switch( mode ) {
    case "day" :
      result = { from: this, to: this }
    case "week" :
    case "month" :
    case "year" :
      result = { from: this, to: this.next( mode ) }
    default :
      console.assert( false, "Unsupported mode `" + mode + "`" )
  }
  //return Object.create( Range8Proto, { "from","to" : { value: result.from, configurable : false, writable : true, enumerable : false } } );
  return result;
}

function _delta( another ): integer { //!!
  console.assert( valid( this ) )

  const from = +this.asDate(),
        to = +_Date8( another ).asDate()
  //console.log("from",from,"to",to);
  return Math.floor( (from - to) / DateTime.OneDay );
}

function _snapTo( period: DatePeriod = "day" ): Date8 {
  console.assert( valid( this ) );

  /// Returns the date "snapped" to the beginning of the specified period (makes easier checking if two times/dates are within the same period, etc)
  switch( period ) {
    case "week" : // Snap to first day of week
      return this.previous( "day", (this.dayOfWeek() + 7 - i18n.firstWeekDay) % 7 ); //!!
    case "day" :
      return this;
    case "month" : // Snap to {month}, 1st
      return _Date8( Math.floor( this.value / 100 ) * 100 + 1 );
    case "year" : // Snap to January 1st
      return _Date8( this.year() * 10000 + 101 );
    default :
      console.assert( false, "Unsupported time period: `" + period + "`" );
  }
}

function _Date8( value: any ): Date8 {
  if( typeof value === "object" && typeof value.value === "number" ) {
    return value;
  } // a Date8?
  if( typeof value === "string" ) {
    value = valueFromISO8601( value );
  } // an ISO8601 date?
  if( value instanceof Date ) {
    value = valueFromDate( value );
  } // a Date?
  if( typeof value === "number" && value > MaxDate8 ) {
    value = valueFromDate( value );
  } // a Timestamp?

  console.assert( valid( value ), value + " is not a valid Date8!" )
  return Object.create( PROTO, { "value": { value: +value, configurable: false, writable: false, enumerable: false } } );
}

function _from( value: any ): Date8 {
console.warn("_from",value)
  return _Date8(value);
}

const Date8 = (function self(): Date8 {

  switch( arguments.length ) {
    case 1 : // construct a Date8
      return _Date8( arguments[0] );
    case 2 : // construct a Date8Range
      return { from: _Date8( arguments[0] ), to: _Date8( arguments[1] ) };
    case 0 :
      if( typeof self.MaxDate8 !== "undefined" ) {
        return today();
      }

      Object.assign( self, { // We only reach here from our own IIFE, let's properly init Date8
        MaxDate8,
        iterator,
        valid, compare,
        previous, next,
        today, yesterday, tomorrow, thisWeek,
        random,
        parse, from: _from,
      } )
      return self;
    default :
      console.assert( false, "Undefined behavior!" )
  }
})();

export {
  MaxDate8,
  Date8,
};
