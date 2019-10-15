"use strict" // @flow

import { toArray } from "gracias/array"
import { Download } from "gracias/web/downloads"
import { Rules } from "gracias/web/rules"

class DownloadManager {
  state : "auto" | "paused" | "stopped"
  queue : Download[]
  rules : DownloadRules
  maxAutoDownloads : ?integer = 9
  maxAutoConnections : ?integer = 9
  defaults = {
    //...DownloadSettings,
    //...PerServerSettings,
  }

  _active : Download[]

  constructor () {
    this.queue = []
  }

  toJSON( key: string ): string {
    return JSON.stringify(this);
  }
  load(json: string) {
    const _saved = JSON.parse(json),
          _clean = _asssign("whitelist", _saved)
    // vardump`${{_saved,_clean}}`
    // TODO Verify _clean is OK
    Object.assign( this, _clean )
    return this;
  }

  select( indices: undefined|integer|integer[] ) : Download[] {
    if( typeof indices === "undefined" ) {
      return this.queue;
    }
    const result = []
    for( idx of (Array.isArray(indices) ? indices : [indices]) ) {
      result.push( this.queue[idx] )
    }
    return result;
  }
  indexOf( item: ?string|RegExp|Download, startIndex: ?integer ): integer {
    const result = -1
    return result;
  }

  _next(): Download[] { // Returns what to download next

  }

  addx(items: string|Download[]) {
    const _items = toArray(items, "lines").map( item => typeof item === "string" ? Download(item) : item )
    // Do a sanity check for _items
    this.queue.unshift( ..._items )
  }
  add( item: string|Download, options = {} ): integer {
    if( typeof item === "string" ) item = new Download( item, options )
    //console.assert( Download item )
    //console.assert( item._check )
    this.queue.push( item )
    return this;
  }
  del( idx: integer ): boolean {
    return !!this.queue.splice( idx, 1 ).length;
  }

  auto_start() {
    if( items_downloaded < N ) {

    }
  }

  start( items: ?Download[], options = {} ): boolean {
    const { forced: boolean, } = options //  forced means

    if( !items ) {
      //!! this.state = "auto"
      items = [] //!! sleep for a while?
    }
    if( typeof items !== "undefined" ) {
      for( item of items ) {
        item.state = forced ? "active" : "auto"
        if( forced ) {
          item.download()
        }
        auto_start()
      }
    }
  }
  pause( items: ?Download[] ): boolean {
    if( !items ) {
      this.state = "paused"
      items = this._active
    }
    console.assert( !items.length )
    for( dl of items ) {
      dl.pause()
    }
  }
  stop( items: ?Download[] ) : boolean {
    if( !items ) {
      this.state = "stopped"
    }
    for( dl of items ) {
      dl.stop()
    }
  }
  restart( items: ?Download[] ): boolean {
    for( dl of items ) {
      dl.stop()
      dl.start()
    }
  }

  tick() {
    //
    this.setTimer()
  }
  setTimer() {
    if( this.active.length ) setTimeout( this.tick, 500 )
  }
}

//    const dl = startDownload( url, options, (err) => {
//      if( err ) {
//        errors.push( err )
//        dl.error = err.message
//      }
//      if( truncated ) {
//        const i = downloads.indexOf( dl );
//        downloads.splice( i, 1 )
//        downloads.push( dl )
//      }
//      if( --pending === 0 ) {
//        render()
//        cb( errors.length ? errors : undefined )
//      }
//    } )
//
//    dl.on( "start", ( stream ) => throttledRender() )
//    dl.on( "progress", ( data ) => {
//      log( "progress", url, data.percentage )
//
//      dl.currSpeed = data.speed
//      if( data.percentage === 100 ) {
//        progress_Console()
//      } else {
//        throttledRender()
//      }
//    } )
//
//    downloads.push( dl )
//  } )
//
//  const throttledRender = throttle( progress_Console, options.frequency || 250 )
//
//  if( options.isSingleTarget ) {
//    return downloads[0];
//  } else {
//    return downloads;
//  }

export {
  Download,
  Rules,
  DownloadManager,
};
