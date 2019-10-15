"use strict" // @flow

export type Css$ClassNames = Array<any>|string

function classArray(...classNames: Css$ClassNames ): string[] {
  let result = []

  for( let i = 0; i < classNames.length; i++ ) {
    let cssClass = classNames[i]

    switch( {}.toString.call(cssClass) ) {
      case "[object String]" :
        result = result.concat( cssClass.split(" ") )
        break;
      case "[object Array]" :
        result = result.concat( cssClass )
        break;
      case "[object Number]" :
        result.push( cssClass )
        break;
      case "[object Object]" :
        for( let k in cssClass ) {
          if( cssClass.hasOwnProperty(k) && cssClass[k] )
            result.push( k )
        }
    }
  }
  //console.log( "classArray!", "in:", classNames, "out:", result )
  return result;
}

function classes(...classNames: Css$ClassNames) {
  return classArray(...classNames).join(" ");
}

function blacklist(classNames: Css$ClassNames, list, self?: Object = this) {
  const result = classArray(classNames);
  //
  return result.join(" ");
}

function whitelist(classNames: Css$ClassNames, list, self?: Object = this ) {
  const result = classArray(classNames);
  //
  return result.join(" ");
}

function addClasses(classNames, self?: Object ) {
  return classes( classNames, self && self.props.className );
}

export {
  classArray,
  classes, classes as cx,
  addClasses, addClasses as cxx,
  whitelist,
  blacklist,
};

// TODO
// [ ] split object properties (like object deconstruction+spread but with wildcards
//       eg: var handlers = x( "on*", this.props, fn );
//       eg: var handlers = x( /on(.*)/, this.props, (name) => toLowerCase(name) ); ~> converts onChange to change, etc
