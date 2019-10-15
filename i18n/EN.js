"use module" // @flow

import { DateTime, Date8, } from "gracias/dates"
import { i18n, } from "gracias/i18n"

//console.log("i18n/EN loaded");

if( !i18n.languages.EN ) {

  i18n.languages.EN = {};

  i18n.languages.EN.select = () => i18n.selectLang("EN");

  i18n.languages.EN.isRTL = false
  i18n.languages.EN.firstWeekDay = 1
  i18n.languages.EN.showMonthAfterYear = false
  i18n.languages.EN.dateFormat2 = "mm/dd/yy"
  i18n.languages.EN.dateFormat4 = "mm/dd/yyyy"
  i18n.languages.EN.dateFormat = "mmmm dd, yyyy"
  i18n.languages.EN.amPM = [ "am", "pm" ]
  i18n.languages.EN.monthNames3 = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
  i18n.languages.EN.monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
  i18n.languages.EN.weekDays2 = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  i18n.languages.EN.weekDays3 = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  i18n.languages.EN.weekDays = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  i18n.languages.EN.xlats = {
    // Use these for a language menu or select (as the language names are available in both languages)
    "|lang-en": "English",
    "|lang-fr": "French (Français)",
    "|lang-ja": "Japanese (日本語)",
    "|lang-zh-cn": "Chinese (中文)",
    "|lang-zh-tw": "Taiwanese (國語)",
    "|lang-es": "Spanish (Español)",
    "|lang-pt-br": "Brazilian Portuguese (Português)",
    "|lang-ru": "Russian (Русский)",

    "English|lang": "English",
    "French|lang": "French",
    "Japanese|lang": "Japanese",
    "Chinese|lang": "Chinese",
    "Chinese/Taiwan|lang": "Taiwanese",
    "Spanish|lang": "Spanish",
    "Portuguese/Brazil|lang": "Brazilian Portuguese",
    "Russian|lang": "Russian",

    _cached: {}
  }
}

export { i18n };
