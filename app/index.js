"use strict" // @flow

import { i18n } from "gracias/i18n"
import { deepAssign } from "gracias/obj"

export type DEV_MODES = "dev"|"test"|"production"
export type LOG_LEVELS = "SILENT"|"CRITICAL"|"ERROR"|"WARNING"|"INFO"|"DEBUG"|"TRACE"

export type FnLog = (level: LOG_LEVELS, msg: string, ...params: any[] ) => void

const App = {

  mixin(...objs: Object[]): typeof App {
    return deepAssign( this, ...objs ); // <()> Notice that the reference stays the same!
  },

  i18n,

  data: {},
  api: {},
  caches: {},
  indexes: {},
  indexed(index: string, item: string): any {
    const indexMap = App.indexes[index]
    if( indexMap ) {
      return indexMap.get(item);
    }
    return;
  },

  isSinglePageApp: undefined, // FIXME

  DEV_MODE: ("dev": DEV_MODES),
  LOG_LEVEL: ("ERROR": LOG_LEVELS),

  log: ( (level, msg, ...params ) => { console.log( msg, ...params ) }: FnLog ),

//  defaults() {
//    if( typeof this._defaults !== "undefined" ) Object.assign( this, this._defaults )
//  },
//  fn( selector: string, fn: ?Function ): void|Function {
//    if( !fn ) { // get
//      const result = _fns[selector]
//      return result;
//    }
//    // set
//  },
//  __setIfEmpty__( selector: string, fn: Function ): void {
//
//  },
}

export {
  App,
  i18n,
};
