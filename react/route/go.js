"use strict" // @flow

import location from "./location"
import bus from "./bus"
//import { parse, } from "./match"

/**
 * Go
 */

function Go(path: string, state?: Object): void {
  console.assert( arguments.length )
  window.history.pushState(state, null, path);
  bus.emit("pushstate", path);
//  } else {
//    var params = {};
//    var m = parse(location.pathname, params);
//    return m && params;
//  }
}

/**
 * Setup the "popstate" events
 */

function onpopstate() {
  var loaded = false;
  if ("undefined" === typeof window) return;
  if (document.readyState === "complete") {
    loaded = true;
  } else {
    window.addEventListener("load", function() {
      setTimeout(function() {
        loaded = true;
      }, 0);
    });
  }

  return function _onpopstate(e) {
    if (!loaded) return;
    bus.emit("popstate", location);
  }
}

/**
 * Start listening for the "popstate" event
 */

window.addEventListener("popstate", onpopstate());

export default Go;
