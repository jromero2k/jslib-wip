"use strict" // @flow

import EventEmitter from "events"

import http from "gracias/web/http"
import log from "gracias/debug/log"
import { ItemRange, ItemFragment } from "gracias/ranges"

type FileAreadyExistsOptions = "ASK_USER" | "OVERWRITE" | "RESUME" | "RENAME"

type DownloadState = "auto"|"active"|"paused"|"stopped"|"pending"|"finished"

type FnDownloadIncommingCallback = ( response: Error|IncomingMessage ) => void // raise an exception to abort
type FnDownloadCompleteCallback = ( item: Download ) => void

type ProxyType = "NONE" | "HTTPS" | "HTTP" | "SOCKS5"
type ProxySettings = {
  type : ProxyType,
  host : ?string,
  port : ?integer,
  username : ?string,
  password : ?string,
  pubkey : ?string,
}

/*
function _onProgress( progress ) {
  progressEmitter.progress = progress
  progressEmitter.percentDone = progress.percentDone
  progressEmitter.emit( "progress", progress )
}
*/

class ProgressMap {
  totalSize : number
  _missing : ItemRanges

  constructor( size: integer ) {
    this.totalSize = size
    this._missing = [ ItemRange(0, size) ]
  }

  valid(): boolean {
    for( fragment of this._missing ) {
      // make sure there's no overlap etc
    }
  }
  missing(): number {
    return this._missing.reduce( (value, item) => value + item.size(), 0 );
  }
  completed(): number {
    return this.totalSize - this.totalMissing();
  }
  next(): ItemFragment {
    const result = this._missing[0]
    return result;
  }
  markAsCompleted( what: ItemFragment|ItemRange ) {
    this._missing.subtract( ItemRange(what) )
  }
}

//type UrlReplacers = undefined|RegExp[]

type PerServerSettings = {
  maxServerConnections : ?integer,
  maxServerThreads : ?integer,

  // Also of interest:
  //   timeout retryWait maxThreads speed resumable
  //   followRedirs maxRedirs trustRedirs doTrackHistory doRestoreServerDates

  contentCheckers: ?FnDownloadChecker[], // if there's a plugin that can verify the download, eg
                                         //   check for "</html>" etc
                                         //   check for file format valid (eg ZIP RAR EXE etc)
                                         //   check file hashes when download finished
  metadataProvider: null, // if there's a plugin that can find metadata for the downloads, eg
                          //   grab correct file hashes for any/some download hosted here
  captchaSolver: null, // if there's a plugin that can get thru a captcha
}

type DownloadSettings = {
  timeout: ?integer,
  retryWait: ?integer,
  maxThreads : ?integer,
  speed: SpeedLimit,
  resumable : ?boolean,
  rules: ?DownloadRules, // eg, to canonicalize/avoid dupes
  doTrackHistory : ?boolean,
  doRestoreServerDates: boolean,

  userAgent : ?string,
  headers : ?string[],
  cookies : ?FilePath,
  proxy : ?ProxySettings,

  maxRedirs : ?integer, // maxRedirs = -1 ~> no redirs allowed
  trustRedirs : boolean,

  whenFileAreadyExists : FileAreadyExistsOptions,
  prefix : ?string, // "."
  suffix : ?string, // ".~unfinished"
  attr : null, // "+h"
}

class Download {
  urls : string[] // urls.length > 1 if there are mirrors
  settings : ?DownloadSettings
  filename : ?FilePath // "path/to/local/file", or:
                       //    undefined ~> not initialized yet
                       //    null ~> download is not to be saved to file (use callback instead to collect?)

  fileOnDisk : ?FilePath // prefix + filename + suffix
  state : DownloadState
  lastStatus : HttpStatus
  map : ?ProgressMap // what about expectedSize?

  _cb: DownloadCallback
  _mgr: DownloadManager

  extra: {} // added_at position order comments known_hashes org_url history log schedule

  // TODO: Use events
  // - init
  // - resuming
  // - resumed
  // - done

  constructor( urls: string, options = {} ) {
    let { headers = {},
        } = options
    this.urls = Array
                  .from( urls.split(/[\n\r]/) )
                  .filter( item => !!item.trim() )
    if( !options.callback ) {
      this.filename = App.fn("url.toFilename")(this.urls[0])
      // this.fileOnDisk =
    }
    this.settings.headers = new Headers(headers)
  }

  load( json: string ): Download {
    const _saved = JSON.parse(json),
          _clean = _asssign("whitelist", _saved)
    // vardump`${{_saved,_clean}}`
    // TODO Verify _clean is OK
    Object.assign( this, _clean )
    return this;
  }

  start() {
    if( this.state in {} ) {
      this.state = ""
      this._downloadFragment(  )
    }
  }
  pause() {
    if( this.state in {} ) {
      this.state = ""
    }
  }
  stop() {
    if( this.state in {} ) {
    }
    this.state = ""
  }

  _wip( options?: { prefix: ?string,
                    suffix: ?string,
                    attr: ?string } = {} ) {
    const { prefix = "",
            suffix = "",
            attr = "", } = options
    //this.prefix =
    //this.suffix =
    if( this.fileOnDisk ) {
      const newFileOnDisk = prefix + this.filename + suffix
      if( newFileOnDisk != this.fileOnDisk ) {
        // rename fileOnDisk
      }
      this.fileOnDisk = newFileOnDisk
    }
  }
  async _done() {
    log( "dl.done", url )
    if( this.fileOnDisk ) {
      // rename fileOnDisk to filename
      if( this.doRestoreServerDates ) {
        await fs.utimes( this.fileOnDisk, null, resp.headers["date"] )
      }
      // restore attrs
      // follow "on_complete" rules: rename, AV-check, descript.ion, etc
    }
    this.state = "finished"
  }
  _url(): string {
    return urls[0]; // TODO first / Cycle / random
  }
  _nextRange(): ItemRange {
    if( map ) {
      return map.next();
    }
  }
  _downloadFragment(): ClientRequest {
    let url = this._url(),
        range = this._nextRange(),
        resume: boolean = range,
        force = false

    fs.stat( target, (err, stats) => {
      if( err ) {
        if( err.code === "ENOENT" ) {
          return downloadFragment( url, options, cb );
        }
        return cb( err );
      }

      const offset = stats.size,
            req = request.get( url )

      req.on( "error", cb )
      req.on( "response", (resp) => {
        resp.destroy()

        const length = parseInt( resp.headers["content-length"], 10 )

        if( length === offset ) { // file is already downloaded
          return cb();
        }

        if( !isNaN( length ) && (length > offset) && /bytes/.test( resp.headers["accept-ranges"] ) ) {
          options.range = [offset, length]
        }

        downloadFragment( url, options, cb )
      } )
    } )

    if( resume ) {
      headers.Range = `bytes=${ range.from }-${ range.to }`
    }
    log( "dl.start", url, range )

    const dl = http.request( { url, headers, } )

    dl.on( "error", _notify )
    dl.on( "response", (resp: IncomingMessage) => {
      log( "dl.response", url, resp.statusCode )
      if( resp.statusCode >= 300 && !force ) {
        return _notify( new Error( { op: "HTTP.GET", operand: url, statusCode: HttpStatus(resp) } ) )
      }

      if( this.fileOnDisk ) {
        const fileOptions = {
            defaultEncoding: "binary",
            flags: resume ? "r+w"    : "w",
            start: resume ? range[0] : 0,
        }
        const body = fs.createWriteStream( this.fileOnDisk, fileOptions, )
        // set attrs
      } else {
        // body =
      }

      body.on( "error", _notify )
      body.on( "finish", _notify )

      let fullLen
      const contentLen = Number( resp.headers["content-length"] )
      const range = Range( resp.headers["content-range"] )
      if( range.to ) {
        fullLen = Number( range.split("/")[1] )
        // console.assert( contentLen === fullLen )
      } else {
        fullLen = contentLen
      }
      //console.assert( fullLen ==

      progressEmitter.fileSize = fullLen
      if( range ) {
        var downloaded = fullLen - contentLen
      }
      const progress = progress( { length : fullLen, transferred : downloaded }, onprogress )
      progressEmitter.emit( "start", progress )

      resp
        .pipe( progress )
        .pipe( body )
    } )

    return dl;

    function _props( options = {} ) {
      const result = {}

      if( options.sockets ) {
        result.pool = { maxSockets : +options.sockets }
      }
      if( options.proxy ) {
        result.proxy = options.proxy
      }
      if( options.strictSSL !== null ) {
        result.strictSSL = options.strictSSL
      }
      return result;

      if( Object.keys(result).length ) { // TODO
        var request = request.defaults( result )
      }
    }

    function _notify(err, res) {
      if( error ) log( "dl.error", url, err )

      return cb(err, res);
    }
  }
}

function _httpStatus( resp: HttpResponse ): HttpStatus {
  const { statusCode, statusMessage } = resp
  return { statusCode, statusMessage };
}

App.fn( "url.fetch", ( url: string, options = {} ): Promise<IncomingMessage> => {
  return new Promise( (resolve, reject) => {
//      reader.onload = function() {
//        resolve(reader.result)
//      }
//      reader.onerror = function() {
//        reject(reader.error)
//      }
  } )
} )
App.fn( "url.fetchJSON", async(url, options ) => {
  await App.fn("url.fetch")(url, options)
/*
  http.get( url, (res) => {
    const statusCode = res.statusCode
    const contentType = res.headers['content-type']

    let error
    if( statusCode !== 200 ) {
      error = new Error( `Request Failed.\n` +
          `Status Code: ${statusCode}` );
    } else if( !/^application\/json/.test( contentType ) ) {
      error = new Error( `Invalid content-type.\n` +
          `Expected application/json but received ${contentType}` );
    }
    if( error ) {
      console.log( error.message );
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding( 'utf8' );
    let rawData = '';
    res.on( 'data', ( chunk ) => rawData += chunk );
    res.on( 'end', () => {
      try {
        let parsedData = JSON.parse( rawData );
        console.log( parsedData );
      }
      catch( e ) {
        console.log( e.message );
      }
    } );
  } ).on( 'error', ( e ) => {
    console.log( `Got error: ${e.message}` );
  } );
*/
} )
//App.fn( "url.download", {saves to a file?}

/*
 defaultOptions ~> downloads which don't have already set will inherit these
 overrideOptions ~> select some urls, edit options
*/

export {
  Download,
};
