"use strict" // @flow

import { Num } from "../num"
import { i18n } from "../i18n"
import { integer } from "gracias/.flow-typed/jrg"

export type TimePeriod = "ms" | "second" | "minute" | "hour"
export type DatePeriod = "day" | "week" | "month" | "year"
export type DateTimePeriod = TimePeriod | DatePeriod

export type DateOnlyRecord = { year: number, month: number, day: number }
export type DateTimeRecord =  { date: integer, time : number,
                                hours: integer, minutes: integer, seconds: integer, milliseconds: integer }

export type AnyDateTime = number | Date | Date8 | DateTime

const OldestDate = -377736739199998, // This date should be old enough: "Sat Jan 01 -10000 00:00:00 GMT"
      OneSecond = 1000,
      OneMinute = OneSecond * 60,
      OneHour = OneMinute * 60,
      OneDay = OneHour * 24,
      OneWeek = OneDay * 7,
      OneYear = OneDay * 365.25

const DateTime = (function self(): DateTime {
  // Terms+Conventions:
  // - date8 ~> a number in the form yyyymmdd (eg, 19731207 ~> December 7, 1973)
  // - datetime ~> a Date instance
  // - timestamp ~> a number (ie, ms from 01/01/1970 00:00:00)
  // - duration ~> difference (in ms) from a timestamp to another (eg, 60,000 = 1min)

  function fromISO8601( str: string ): Date {
    const result = String( str )
        .trim()
        .replace( /\.\d+/, "" ) // remove milliseconds part, if present
        .replace( /T/, " " ).replace( /Z/, " UTC" )
        .replace( /(\d\d\d\d)-(\d\d)-(\d\d)/, "$1/$2/$3" )  // 2011-03-09 ~> 2011/03/09
        .replace( /(\d\d\d\d)-(\d\d)/, "$1/$2" )     // 2011-03 ~> 2011/03
        .replace( /(\d\d\d\d)(\d\d)(\d\d)/, "$1/$2/$3" )  // 20110309 ~> 2011/03/09
        .replace( /(\d\d\d\d)(\d\d)/, "$1/$2" )     // 201103 ~> 2011/03
        .replace( /([\+\-]\d\d):?(\d\d)/, " $1$2" )     // -05:30 ~> -0530
        .replace( /([\+\-]\d\d)$/, " $100" );    // +05 ~> +0500
    return new Date( result );
  }

  function fromDate8( date8: Date8 ): Date {
    return fromISO8601( date8 );
  }

  function fromHtml( selector: any ): Date { // Extracts a datetime from the specified HTML element (expects jQuery!)
    /*eslint-env jquery */
    console.assert( selector )
    const $elem = $( selector ),
        dt = $elem.attr( "datetime" ) || $elem.attr( "title" )
    return fromISO8601( dt );
  }

  function fromWeek( weekNo: integer, weekDay: integer ): Date { // fromWeek(0, 0) = January 1, etc
    return new Date( +fromISO8601( thisYear() + "-01" ) + weekNo * OneWeek + (weekDay || 0) * OneDay );
  }

  function _from( date: any ): Date {
    switch( typeof date ) {
      case "string":
        return fromISO8601( date );
      default:
        console.assert( false, "UNFINISHED" )
    }
  }

  function parseTime( anyDateTime: any ): DateTimeRecord { //!!
    anyDateTime = asTimestamp( anyDateTime )

    const _time = Math.floor( anyDateTime % OneDay ),
        _hours = Math.floor( _time / OneHour ),
        _minutes = Math.floor( (_time - _hours * OneHour) / OneMinute ),
        _seconds = Math.floor( (_time - _hours * OneHour - _minutes * OneMinute) / OneSecond ),
        _mseconds = _time % OneSecond,
        _date = Math.floor( anyDateTime - _time )
    return {
      date: _date,
      time: _time,

      hours:        _hours,
      minutes:      _minutes,
      seconds:      _seconds,
      milliseconds: _mseconds,
    };
  }

  function parseTimeLocal( anyDateTime: any ): DateTimeRecord {
    anyDateTime = asTimestamp( anyDateTime );
    return parseTime( anyDateTime - timezoneOffset( anyDateTime ) );
  }

  function parseDate( anyDateTime: any ): DateTimeRecord {
    const _date = asDate( anyDateTime )
    return {
      year:  _date.getUTCFullYear(),
      month: _date.getUTCMonth(),
      day:   _date.getUTCDate(),
    };
  }

  function parseDateLocal( anyDateTime: any ): DateTimeRecord {
    const _date = asDate( anyDateTime )
    return {
      year:  _date.getFullYear(),
      month: _date.getMonth(),
      day:   _date.getDate(),
    };
  }

  function asTimestamp( anyDateTime: any ): number {
    if( typeof anyDateTime === "number" ) {
      return +anyDateTime;
    }
    if( anyDateTime instanceof Date ) {
      return +anyDateTime;
    }
    if( typeof anyDateTime === "string" ) {
      return +fromISO8601( anyDateTime );
    }
    return +fromHtml( anyDateTime );
  }

  function asDate( anyDateTime: any ): Date {
    if( typeof anyDateTime === "number" ) {
      return new Date( anyDateTime );
    }
    if( anyDateTime instanceof Date ) {
      return anyDateTime;
    }
    if( typeof anyDateTime === "string" ) {
      return fromISO8601( anyDateTime );
    }
    return fromHtml( anyDateTime );
  }

  function inRange( anyDateTime: any, range: RangeRecord ): boolean {
    let from, to;
    if( arguments.length === 3 ) {
      from = arguments[1];
      to = arguments[2];
    } else {
      from = range.from || OldestDate;
      to = range.to || Date.now();
    }
    console.assert( typeof anyDateTime !== "undefined" );

    return delta( anyDateTime, from ) >= 0 && delta( anyDateTime, to ) <= 0;
  }

  function equal( a: any, b: any ): boolean { return !delta( a, b ); }

  function delta( a: any, b: any = Date.now() ): number {
    if( typeof a !== "number" || typeof b !== "number" ) {
      console.assert( a != null )
      // normalize both dates
      a = asTimestamp( a );
      b = asTimestamp( b );
    }
    return a - b;
  }

  function timeDelta( a: any, b: any ): number { //!!
    return (asTimestamp( a ) - asTimestamp( b )) % OneDay; //!!
  }

  function timezoneOffset( anyDateTime: any ): number {
    return OneMinute * asDate( anyDateTime || today() ).getTimezoneOffset();
  }

  function date( anyDateTime: any ): Date { /// Returns the specified date at 12:00am GMT
    return asDate( Math.floor( asTimestamp( anyDateTime ) / OneDay ) * OneDay ); // drop time part
  }

  function dateLocal( anyDateTime: any ): Date { /// Returns the specified date at 12:00am (LOCAL time)
    const _date = asDate( anyDateTime );
    return fromISO8601( "" + _date.getFullYear() + Num.lpad2( _date.getMonth() + 1 ) + Num.lpad2( _date.getDate() ) ); // FIXME
  }

  function snapTo( anyDateTime: any, period: DateTimePeriod = "day" ): Date {
    /// Returns the date "snapped" to the beginning of the specified period (makes easier checking if two times/dates are within the same period, etc)
    /// NOTE: for day+up ranges it drops time to 12:00am UTC
    let result
    switch( period ) {
      case "hour" :
        return new Date( Math.floor( asTimestamp( anyDateTime ) / OneHour ) * OneHour ); // drop minutes+etc
      case "day" :
        return date( anyDateTime );
      case "week" : // Snap to first date of week
        result = date( anyDateTime )
        result.setUTCDate( result.getUTCDate() - result.getUTCDay() )
        return result;
      case "month" : // Snap to {month}, 1st
        result = date( anyDateTime )
        result.setUTCDate( 1 )
        return result;
      case "year" : // Snap to January, 1st
        result = date( anyDateTime )
        result.setUTCDate( 1 )
        result.setUTCMonth( 0 )
        return result;
      default :
        console.assert( false, "Unsupported time period: `" + period + "`" )
    }
  }

  function snapToLocal( anyDateTime: any, period: DateTimePeriod = "day" ): Date {
    /// Returns the date "snapped" to the beginning of the specified period (makes easier checking if two times/dates are within the same period, etc)
    /// NOTE: for day+ ranges it drops time to 12:00am *LOCAL*
    let result
    switch( period ) {
      case "hour" :
        return new Date( Math.floor( asTimestamp( anyDateTime ) / OneHour ) * OneHour - timezoneOffset( anyDateTime ) ); // drop minutes+etc
      case "day" :
        return dateLocal( anyDateTime );
      case "week" : // Snap to first date of week
        result = dateLocal( anyDateTime )
        result.setDate( result.getDate() - (result.getDay() || 7) + i18n.firstWeekDay )
        return result;
      case "month" : // Snap to {month}, 1st
        result = dateLocal( anyDateTime )
        result.setDate( 1 )
        return result;
      case "year" : // Snap to January, 1st
        result = dateLocal( anyDateTime )
        result.setDate( 1 )
        result.setMonth( 0 )
        return result;
      default :
        console.assert( false, "Unsupported time period: `" + period + "`" )
    }
  }

  function previous( anyDateTime: any, period: DateTimePeriod = "day", count?: number = 1 ): Date {
    let result

    if( arguments.length < 3 ) {
      if( typeof arguments[0] === "string" ) {
        anyDateTime = Date.now()
        period = arguments[0]
        count = arguments[1]
        console.assert( period in { "hour": 0, "day": 0, "week": 0, "month": 0, "year": 0 } )
      }
    }

    anyDateTime = asTimestamp( anyDateTime )
    switch( period ) {
      case "hour" :
        return new Date( anyDateTime - count * OneHour );
      case "day" :
        return new Date( anyDateTime - count * OneDay );
      case "week" :
        return new Date( anyDateTime - count * OneWeek );
      case "month" :
        result = asDate( anyDateTime )
        result.setUTCMonth( result.getUTCMonth() - count )
        return result;
      case "year" :
        result = asDate( anyDateTime )
        result.setUTCFullYear( result.getUTCFullYear() - count )
        return result;
      default :
        console.assert( false, "Unsupported time period: `" + period + "`" )
    }
  }

  function next( anyDateTime: any, period: DateTimePeriod = "day", count?: number = 1 ): Date {
    let result

    if( arguments.length < 3 ) {
      if( typeof arguments[0] === "string" ) {
        anyDateTime = Date.now()
        period = arguments[0]
        count = arguments[1]
        console.assert( period in { "hour": 0, "day": 0, "week": 0, "month": 0, "year": 0 } )
      }
    }

    anyDateTime = asTimestamp( anyDateTime )
    switch( period ) {
      case "hour" :
        return new Date( anyDateTime + count * OneHour );
      case "day" :
        return new Date( anyDateTime + count * OneDay );
      case "week" :
        return new Date( anyDateTime + count * OneWeek );
      case "month" :
        result = asDate( anyDateTime )
        result.setUTCMonth( result.getUTCMonth() + count )
        return result;
      case "year" :
        result = asDate( anyDateTime )
        result.setUTCFullYear( result.getUTCFullYear() + count )
        return result;
      default :
        console.assert( false, "Unsupported time period: `" + period + "`" )
    }
  }

  const today = (): Date => date( Date.now() );
  const todayLocal = (): Date => dateLocal( Date.now() );
  const yesterday = (): Date => previous( today() );
  const yesterdayLocal = (): Date => previous( todayLocal() );
  const tomorrow = (): Date => next( today() );
  const tomorrowLocal = (): Date => next( todayLocal() );

  const thisMonth = (): integer => asDate( Date.now() ).getUTCMonth();
  const thisMonthLocal = (): integer => asDate( Date.now() ).getMonth();
  const thisYear = (): integer => asDate( Date.now() ).getUTCFullYear();
  const thisYearLocal = (): integer => asDate( Date.now() ).getFullYear();

  function forEach( mode: DateTimePeriod = "day", range: RangeRecord, callback: FnCallback, context: any ): void {
    for( let dt = range.from; dt <= range.to; dt = next( dt, mode ) ) {
      callback.call( context, dt )
    }
  }

  function random( /* `{from,to}` or `from, to` */ ) { // Returns a random date within the specified [from..to] dates
    let now: number,
        arg: RangeRecord | any,
        from: number, to: number

    switch( arguments.length ) {
      case 0 :
        from = OldestDate;
        to = Date.now();
        break;
      case 1 :
        now = +Date.now();
        arg = arguments[0];

        if( arg.from != null || arg.to != null ) {
          ({ from, to } = arg)
          if( from == null ) {
            from = now;
          }
          if( to == null ) {
            to = now;
          }
        } else {
          console.assert( arg != null, "" );

          arg = asTimestamp( arg );
          if( delta( now, arg ) > 0 ) {
            from = arg;
            to = now
          } else {
            from = now;
            to = arg
          }
          break;
        }
      case 2 :
        from = asTimestamp( from )
        to = asTimestamp( to )
    }
    return new Date( from + Num.random( to - from ) );
  }

  function randomDuration( from, to ) { // Returns a random duration within specified [from..to] range
    if( !from ) {
      from = 0;
    }
    if( !to ) {
      to = 24 * OneHour;
    }

    if( from > 0 && from <= 24 ) {
      from = from * OneHour;
    } // If {from} in [1..24], it's probable the user meant {from} hours, not ~20ms
    if( to > 0 && to <= 24 ) {
      to = to * OneHour;
    } // If {to} in [1..24], it's probable the user meant {to} hours, not ~20ms

    return from + Num.random( to - from );
  }

  function randomTime( from?: DateTime, to?: DateTime ) { // Returns a random time within today's specified [from..to] time
    return new Date( +todayLocal() + randomDuration( from, to ) );
  }

  return {
    monkeyPatch,

    OneYear, OneWeek, OneDay, OneHour, OneMinute, OneSecond,
    OldestDate,

    asDate, asTimestamp,
    from: _from, fromDate8, fromISO8601, fromWeek,
    timezoneOffset,
    parseDate, parseDateLocal, parseTime, parseTimeLocal,
    inRange, equal, delta, timeDelta,
    date, dateLocal,
    snapTo, snapToLocal,
    previous, next, yesterday, yesterdayLocal, today, todayLocal, tomorrow, tomorrowLocal,
    thisMonth, thisMonthLocal, thisYear, thisYearLocal,
    random, randomTime, randomDuration,
    forEach,
  };

  function monkeyPatch() { // Monkey-patch Date + etc
    Object.assign( Date.prototype, {
      yesterday, yesterdayLocal, today, todayLocal, tomorrow, tomorrowLocal,
      thisMonth, thisMonthLocal, thisYear, thisYearLocal,

      previous( period: DateTimePeriod, count?: number = 1 ): Date { return DateTime.previous( this, period, count ); },
      next( period: DateTimePeriod, count?: number = 1 ): Date { return DateTime.next( this, period, count ); },
      parseDate(): DateTimeRecord { return DateTime.parseDate( this ); },
      parseDateLocal(): DateTimeRecord { return DateTime.parseDateLocal( this ); },
      parseTime(): DateTimeRecord { return DateTime.parseTime( this ); },
      parseTimeLocal(): DateTimeRecord { return DateTime.parseTimeLocal( this ); },
      inRange( range: RangeRecord ): boolean { return DateTime.inRange( this, range ); },
      equal( date: any ): boolean { return DateTime.equal( this, date ); },
      delta( date: any ): number { return DateTime.delta( this, date ); },
      timeDelta( date: any ): number { return DateTime.timeDelta( this, date ); },
    } )
  }
})();

export {
  OneSecond, OneMinute, OneHour, OneDay, OneWeek, OneYear,

  DateTime,
};
