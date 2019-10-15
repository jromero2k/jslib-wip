"use strict" // @flow

import { i18n } from "./root"
import { DateTime, Date8, } from "../dates"
import { Num, } from "../num"

//console.log("i18n.defaults loaded");

if( !i18n.defaults ) {
  i18n.defaults = {

    formatting: {
      numbers:    {
        separator: ".",
        delimiter: ",",
        precision: 3,
      },
      currency:   {
        format:    "%u%n",
        unit:      "$",
        separator: ".",
        delimiter: ",",
        precision: 2,
      },
      percentage: {
        delimiter: "",
      },
      human:      {
        delimiter: "",
        precision: 1,
      },
      storage:    {
        format: "%n %u",
      },
      date:       {
        format:      "%d-%m-%Y",
        formatShort: "%b %d",
        formatLong:  "%B %d, %Y",
      },
      time:       {
        format:      "%a, %d %b %Y %H:%M:%S %z",
        formatShort: "%d %b %H:%M",
        formatLong:  "%B %d, %Y %H:%M",
        am:          "am",
        pm:          "pm",
      },
      datetime:   {
        distance_in_words: {
          half_a_minute:       "half a minute",
          less_than_x_seconds: {
            one:   "less than 1 second",
            other: "less than ${count} seconds",
          },
          x_seconds:           {
            one:   "1 second",
            other: "${count} seconds",
          },
          less_than_x_minutes: {
            one:   "less than a minute",
            other: "less than ${count} minutes",
          },
          x_minutes:           {
            one:   "1 minute",
            other: "${count} minutes",
          },
          about_x_hours:       {
            one:   "about 1 hour",
            other: "about ${count} hours",
          },
          x_days:              {
            one:   "1 day",
            other: "${count} days",
          },
          about_x_months:      {
            one:   "about 1 month",
            other: "about ${count} months",
          },
          x_months:            {
            one:   "1 month",
            other: "${count} months",
          },
          about_x_years:       {
            one:   "about 1 year",
            other: "about ${count} years",
          },
          over_x_years:        {
            one:   "over 1 year",
            other: "over ${count} years",
          },
          almost_x_years:      {
            one:   "almost 1 year",
            other: "almost ${count} years",
          },
        },
      },
    },

    weekDay: function( relWeekDay: integer ): integer { /// 0 ~> first day of week for this locale
      return i18n.weekDays[(relWeekDay + i18n.firstWeekDay) % 7];
    },

    weekDay2: function( relWeekDay: integer ): integer { /// 0 ~> first day of week for this locale
      return i18n.weekDays2[(relWeekDay + i18n.firstWeekDay) % 7];
    },

    weekDay3: function( relWeekDay: integer ): integer { /// 0 ~> first day of week for this locale
      return i18n.weekDays3[(relWeekDay + i18n.firstWeekDay) % 7];
    },

    friendly: function( period: DateTimePeriod | any, anyDateTime: any ): string {
      let result
      if( arguments.length === 1 ) { // friendly(dt) ~> friendly("day",dt)
        anyDateTime = period
        period = "day"
      }
      switch( period ) {
        case "second" :
          return i18n.toTime( anyDateTime, "hms" );
        case "minute" :
        case "hour" :
          return i18n.toTime( anyDateTime, "hm" );
        case "week" :
        case "day" :
          let result, parsed
          if( Date8.valid( anyDateTime ) ) { // a Date8?
            parsed = Date8.parse( anyDateTime )
          } else {
            parsed = DateTime.parseDateLocal( anyDateTime )
          }
          //vardump`${{anyDateTime, parsed}} )`;
          result = i18n.monthNames[parsed.month] + " " + parsed.day
          if( parsed.year !== DateTime.thisYearLocal() ) {
            result += ", " + parsed.year
          }
          return result;
        case "month" :
          anyDateTime = Date8( anyDateTime ).asDate()
          result = i18n.monthNames[anyDateTime.getMonth()]
          if( anyDateTime.getFullYear() !== DateTime.thisYearLocal() ) {
            result += ", " + anyDateTime.getFullYear()
          }
          return result;
        case "year" :
          return Date8( anyDateTime ).asDate().getFullYear();
        default :
          console.assert( false, "Unsupported time period", period )
      }
    },

    duration: function( duration: number, format?: string ): string { /// duration("2hms") ~> returns hours, minutes or seconds, but only the most significant 2 of these
      let result = "",
          max = 99, count = 0, digits

      function _add( timelapse, suffix ) {
        const v = Num.divmod( duration, timelapse );
        if( count < max && v.div ) {
          result = result + v.div + suffix + " ";
          duration = v.mod;
          count++;
        }
      }

      if( !format ) {
        format = "ynwdhm";
      }
      digits = format.match( /\d/g )
      if( digits ) {
        if( digits.length === format.length ) {
          format = "ynwdhm";
        }
        max = Number( digits.sort( Num.sortDesc )[0] ) // get the largest digit specified, if any
      }

      if( format.includes( "y" ) ) {
        _add( DateTime.OneYear, i18n( "yr|years" ) );
      }
      if( format.includes( "n" ) ) {
        _add( DateTime.OneDay * 30.43, i18n( "mo|months" ) );
      }
      if( format.includes( "w" ) ) {
        _add( DateTime.OneWeek, i18n( "w|weeks" ) );
      }
      if( format.includes( "d" ) ) {
        _add( DateTime.OneDay, i18n( "d|days" ) );
      }
      if( format.includes( "h" ) ) {
        _add( DateTime.OneHour, i18n( "h|hours" ) );
      }
      if( format.includes( "m" ) ) {
        _add( DateTime.OneMinute, i18n( "m|minutes" ) );
      }
      if( format.includes( "s" ) ) {
        _add( DateTime.OneSecond, i18n( "s|seconds" ) );
      }
      if( result === "" ) {
        return "0";
      }
      return result.trim();
    },

    ago: function( anyDateTime: any ): string {
      var amount, period,
          then = DateTime.asTimestamp( anyDateTime ),
          now = +Date.now(),
          duration = Math.round( Math.abs( now - then ) )
      if( duration < DateTime.OneMinute ) {
        amount = Math.round( duration / DateTime.OneSecond )
        period = "second"
      } else if( duration < DateTime.OneHour ) {
        amount = Math.round( duration / DateTime.OneMinute )
        period = "minute"
      } else if( duration < DateTime.OneDay ) {
        amount = Math.round( duration / DateTime.OneHour )
        period = "hour"
      } else if( duration < DateTime.OneWeek ) {
        amount = Math.round( duration / DateTime.OneDay )
        period = "day"
      } else if( duration < DateTime.OneDay * 30 ) {
        amount = Math.round( duration / DateTime.OneWeek )
        period = "week"
      } else if( duration < DateTime.OneYear ) {
        amount = Math.round( duration / (DateTime.OneDay * 30) )
        period = "month"
      } else {
        amount = Math.round( duration / DateTime.OneYear )
        period = "year"
      }
      return amount + " " + i18n( period + ( amount > 1 ? "s" : "" ) ) + " " + i18n( then <= now ? "ago|" : "from now|" ); //!!
    },

    toWeekDay: function( datetime: any ): integer {
      return i18n.weekDays[DateTime.asDate( datetime ).getDay()];
    },

    toDate: function( datetime: any, format?: string ) {
    },

    toTime24: function( anyDateTime: any, format?: string ): string {
      var parsed = DateTime.parseTimeLocal( anyDateTime )

      //console.log("~time24", parsed); //!!
      switch( format ) {
        case undefined :
        case "hm" :
          return parsed.hours + ":" + Num.lpad2( parsed.minutes );
        case "hms" :
          return parsed.hours + ":" + Num.lpad2( parsed.minutes ) + ":" + Num.lpad2( parsed.seconds );
        default :
          console.assert( false, "Unknown time format", format )
      }
    },

    toTime12: function( anyDateTime: any, format: string ): string {
      var parsed = DateTime.parseTimeLocal( anyDateTime ),
          hr = parsed.hours % 12 || "12",
          ampm = parsed.hours >= 12 ? "pm" : "am"

      switch( format ) {
        case undefined :
        case "hm" :
          return hr + ":" + Num.lpad2( parsed.minutes ) + ampm;
        case "hms" :
          return hr + ":" + Num.lpad2( parsed.minutes ) + ":" + Num.lpad2( parsed.seconds ) + ampm;
        default :
          console.assert( false, "Unsupported time format", format );
      }
    },

    translate: function( literals?: string|string[], ...args?: any[] ): string {
      if( literals === "" || literals == null ) {
        return "";
      }

      if( typeof literals === "string" ) { // i18n("something")
        const str = literals

        let result = i18n.currLang.xlats._cached[str];
        if( !result ) {
          result = i18n.currLang.xlats[str];

          if( !result ) {
            let [value = "", annot = ""] = str.split( "|", 2 )

            if( value === "" ) {
              console.assert( annot )
              result = i18n.currLang.xlats[str]
            } else {
              if( annot.includes( "~" ) ) { // Match case-insensibly (retaining case?)
                result = i18n.currLang.xlats[value] // TODO
              } else {
                result = i18n.currLang.xlats[value]
              }
            }
            if( !result ) {
              console.warn( `Translation missing for ${str}` )
              result = value
            }

            if( annot.includes( "+" ) ) { // TODO Do plural conversion
              result = result + "s" // TODO i18n.plural(value);
            }

            if( annot.includes( "..." ) ) {
              result += "....";
            }
            if( annot.includes( "…" ) ) {
              result += "…";
            }
            if( annot.includes( "^" ) ) {
              result = result.toUpperCase();
            }
            if( annot.includes( "_" ) ) {
              result = result.toLowerCase();
            }
          }
          i18n.currLang.xlats._cached[str] = result
        }
        return result || str;
      } else {  // i18n`something ${etc}`
        // TODO Match vs the literals array (eg, ["You have ",:number," new email(s)"] ~> ["Tiene ",:number," nuevos correos"]
        let result = i18n.translate( literals[0] )
        for( const [i, arg] of args.entries() ) {
          const original = literals[i + 1],
              xlat = i18n.translate( original )
          result += arg + (xlat !== undefined) ? xlat
              : original
        }
        return result;
      }
    },
  }

  i18n.defaults.toTime = i18n.defaults.toTime12
}

export { i18n };

//activerecord:
//  errors:
//    messages:
//      invalid: "is invalid",
//      confirmation: "doesn't match confirmation",
//      accepted: "must be accepted",
//      empty: "can't be empty",
//      blank: "can't be blank",
//      too_long: "is too long (maximum is ${count} characters)",
//      too_short: "is too short (minimum is ${count} characters)",
//      wrong_length: "is the wrong length (should be ${count} characters)",
//      taken: "has already been taken",
//      not_a_number: "is not a number",
//      not_an_integer: "must be an integer",
//      greater_than: "must be greater than ${count}",
//      greater_than_or_equal_to: "must be greater than or equal to ${count}",
//      equal_to: "must be equal to ${count}",
//      less_than: "must be less than ${count}",
//      less_than_or_equal_to: "must be less than or equal to ${count}",
//      odd: "must be odd",
//      even: "must be even",
//      record_invalid: "Validation failed: ${errors}",
//support:
//  array:
//    words_connector: ", "
//    two_words_connector: " and "
//    last_word_connector: ", and "
//  template:
//    header: ""
//    body: "There were problems with the following fields:"
//  format: "${attribute} ${message}"
//  messages:
//    not_found: "not found"
//    already_confirmed: "was already confirmed"
//    not_locked: "was not locked"
//    inclusion: "is not included in the list"
//    exclusion: "is reserved"
//    invalid: "is invalid"
//    confirmation: "doesn't match confirmation"
//    accepted: "must be accepted"
//    empty: "can't be empty"
//    blank: "can't be blank"
//    too_long: "is too long (maximum is ${count} characters)"
//    too_short: "is too short (minimum is ${count} characters)"
//    wrong_length: "is the wrong length (should be ${count} characters)"
//    not_a_number: "is not a number"
//    greater_than: "must be greater than ${count}"
//    greater_than_or_equal_to: "must be greater than or equal to ${count}"
//    equal_to: "must be equal to ${count}"
//    less_than: "must be less than ${count}"
//    less_than_or_equal_to: "must be less than or equal to ${count}"
//    odd: "must be odd"
//    even: "must be even"
