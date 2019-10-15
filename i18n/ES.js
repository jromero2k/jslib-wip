"use module" // @flow

import { DateTime, Date8, } from "gracias/dates"
import { i18n, } from "gracias/i18n"

//console.log("i18n/ES loaded");

if( !i18n.languages.ES ) {

  i18n.languages.ES = {}

  i18n.languages.ES.select = () => i18n.selectLang("ES");

  i18n.languages.ES.isRTL = false
  i18n.languages.ES.firstWeekDay = 1
  i18n.languages.ES.showMonthAfterYear = false
  i18n.languages.ES.dateFormat2 = "dd/mm/yy"
  i18n.languages.ES.dateFormat4 = "dd/mm/yyyy"
  i18n.languages.ES.dateFormat = "dd mmmm, yyyy"
  i18n.languages.ES.amPM = [ "am", "pm" ]
  i18n.languages.ES.monthNames3 = [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ]
  i18n.languages.ES.monthNames = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ]
  i18n.languages.ES.weekDays2 = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]
  i18n.languages.ES.weekDays3 = ["Dom", "Lun", "Mar", "Mie", "Juv", "Vie", "Sab"]
  i18n.languages.ES.weekDays = [ "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

  i18n.languages.ES.toDate = ( datetime: AnyDateTime ): string => {
    let result, parsed

    if( Date8.valid(datetime) ) { // a Date8?
      parsed = Date8.parse(datetime)
    } else {
      parsed = DateTime.parseDateLocal( datetime )
    }
    result = parsed.day + " " + i18n.monthNames[parsed.month]
    if( parsed.year !== DateTime.thisYearLocal() ) {
      result += ", " + parsed.year
    }
    return result;
  }

  i18n.languages.ES.xlats = {
    // Use these for a language menu or select (as the language names are available in both languages)
    "|lang-en": "Inglés (English)",
    "|lang-fr": "Francés (Français)",
    "|lang-ja": "Japonés (日本語)",
    "|lang-zh-cn": "Chino (中文)",
    "|lang-zh-tw": "Chino Taiwán (國語)",
    "|lang-es": "Español",
    "|lang-pt-br": "Portugués Brasil (Português)",
    "|lang-ru": "Ruso (Русский)",

    "English|lang": "Inglés",
    "French|lang": "Francés",
    "Japanese|lang": "Japonés",
    "Chinese|lang": "Chino",
    "Chinese/Taiwan|lang": "Chino (Taiwán)",
    "Spanish|lang": "Español",
    "Portuguese/Brazil|lang": "Portugués Brasileño",
    "Russian|lang": "Ruso",

    "today" : "hoy",

    "name": "nombre",

    "N/A" : "N/A",

    "about|app":      "acerca de",
    "password":       "contraseña",
    "email address":  "email",
    "remember me":    "recuérdeme", //!!
    "log in":         "log in", //!!
    "please log in":  "por favor, login", //!!
    "show menu":      "menú", //!!

    "search": "buscar",

    "ago|prefix": "",
    "ago|": "",
    "from now|prefix": "",
    "from now|": "",
    "any moment now" : "",
    "less than a minute" : "",
    "about a minute" : "",
    "%d minutes" : "",
    "about an hour" : "",
    "about %d hours" : "",
    "a day" : "",
    "%d days" : "",
    "about a month" : "",
    "%d months" : "",
    "about a year" : "",
    "%d years" : "",

    units : {
      time : {
        "second" : "segundo",
        "min|" : "min",
        "minute" : "minuto",
        "hr|" : "hr",
        "hour" : "hora",
        "d|": "d",
        "day": "día",
        "wk|": "semana",
        "week": "semana",
        "mo": "mes",
        "month": "mes",
        "yr|": "año",
        "year": "año",
      },
      len : {
        "m": "m",
        "meter": "metro",
        "km": "km",
        "kilometer": "kilómetro",
        "mile": "milla",
      },
      bytes : {
        "byte": "byte",
        "KB": "KB",
        "MB": "MB",
        "GB": "GB",
        "TB": "TB",
      },
    },

    _cached: {}
  }
}

export { i18n };
