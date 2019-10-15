"use strict" // @flow

import { onlyAssign, missingKeys, } from "../obj"

/*
  TODO:

  [ ] Three-letter sublanguages + etc
  [ ] Re-render support when language changed  ~> eg, a React mixin?

 */

const langProps = `isRTL
                   showMonthAfterYear amPM
                   monthNames monthNames3 weekDays weekDays3 weekDays2 firstWeekDay
                   formatting
                   strings
                   weekDay weekDay2 weekDay3 toWeekDay
                   toDate dateFormat2 dateFormat4
                   toTime toTime12 toTime24
                   friendly duration ago
                   translate
`

//console.log("i18n loaded");

const i18n = function( literals: string[], ...values: any[] ) {
  console.assert( i18n.currLang, "You should install some language before using this!" )
  return i18n.translate( literals, ...values );
};

if( !i18n.languages ) { // not initialized yet?

  i18n.languages = {};
  i18n.currLang = undefined;

  i18n.selectLang = (lang) => {
    console.assert( i18n.languages[lang] != null, "Unknown language `" + lang + "` specified." )

    i18n.currLang = i18n.languages[lang]
    onlyAssign( langProps, i18n, i18n.currLang, i18n.defaults )

    // Log what's in i18n.defaults that wasn't copied to i18n, in case we forget to update langProps
    if( true ) {
      const missing = missingKeys( i18n, i18n.defaults )
      if( Object.keys(missing).length ) console.warn( "Update langProps?", missing )
    }

    return i18n;
  }
}

/*
*/

/* WIP * WIP * WIP * WIP * WIP * WIP * WIP * WIP * WIP * WIP * WIP * WIP * WIP * WIP * WIP * WIP * WIP * WIP * WIP * WIP * WIP

  Special patterns: ~> NOTE: Without the `|suffix` the value is just replaced as is, but `|suffix` activates special processing:

  # Plural/Singular

    register:
     source: `singular|+suffix` or `singular|plural` or `singular|dual|plural` or `1=singular|2=dual|3+=plural` etc
     target: {same}
         "${n} pencil"
    usage:
      {`singular|+` or `plural|+`}

 # Units (`|=`) or (`|zzz=`)

    "km|=": "km"
    "mile|s=": "milla|+s"
*/

export { i18n };
