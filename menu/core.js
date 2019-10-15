"use strict" // @flow

function Menu( strs: string[], ...args: any[] ) {
  let result = strs[0]
  for( const [i, arg] of args.entries() ) {
    if( arg === null || typeof arg !== "object" ) {
    } else {
      for( const [k, v] of Object.entries(arg) ) {
      }
    }
    result += strs[i + 1]
  }
  return result
}

/*
Menu`item1 ~> id
     item2
     -
     #Header
     #Submenu {
       item3 ~> id
       item4
       -
       item5
     }
     ${include}
`
submenus
includes
*/

function renderMenu( items: Array, { fnMenu : FnMenu, fnMenuItem : FnMenuItem, fnDivider : FnMenuDivider } = {} ) {

}

export default {

};
