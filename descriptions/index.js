"use strict" // @flow

import path from "path"
import fs from "fs-promised"
import iconv from "iconv"

function orEmpty( str? : any  ) : string { // Surrounds str with quotes but only if needed (str contains spaces)
  if( str == null || str === false ) return "";
  // NaN
  return String(str);
}

function quotes( str : string, quoteChar : string = '"'  ) : string { // Surrounds str with quotes but only if needed (str contains spaces)
  const result = String(str).trim()
  if( result.includes(" ") ) return quoteChar + result + quoteChar;
  return result;
}

function unquotes( str : string ) : string { // Removes quotes if needed
  const result = String(str).trim()
  if( result.startsWith(`"`) ) {
    console.assert( result.endsWith(`"`) )
    return result.slice( 1, result.length - 1 );
  }
  return result;
}

const DESCRIPT_ION = "descript.ion"

async function _readFile( filename: FilePath, encoding: ?string ): string {
  console.assert( !!filename, "" )
  try {
    return await fs.readFile( filename, { encoding: "binary" } );
  } catch (err) {
    if( fs.existsSync(filename) ) console.log( err ); // TODO
    return undefined;
  }
}

async function _saveFile( filename: FilePath, text : string[] | Buffer  ) {
  if( fs.existsSync(filename) ) {
    try {
      await fs.chmod( filename, 0o666 )
      await fs.unlink( filename )
    } catch(err) {
      console.log( err ); // TODO
    }
  }
  await fs.writeFile( filename, text.join("\r\n"), "binary" )
}

const PROTO = {
  get size(): integer { return ( this._entries || 0 ) && this._entries.size },
  get path(): FilePath { return this._dir },
  get file(): FilePath { return path.join( this._dir, DESCRIPT_ION ) },

  async _read() {
    return await _readFile( this.file() );
  },
  async _write( text : string[] | Buffer ) {
    return await _writeFile( this.file(), text );
  },

  async load( dir : string ) {
    console.assert( this )

    this._entries.clear()
    this._dir = path.resolve(dir) || this._dir
      console.assert( this._dir, "Need a directory to load DESCRIPT.IONs from" )

    const text = await this._read()
    await this.parse( text )

    return this;
  },
  async save( dir? : string ) {
    console.assert( this, "!!" )

    if( dir ) {
      console.assert( !this._dir || this._dir === path.resolve(dir), "!!" )
      this._dir = path.resolve(dir)
    }
    console.assert( this._dir, "!!" )

    const text = []
    for( const item of _entries ) {
      let descr = item.descr
      if( Array.isArray(descr) ) {
        descr = descr
                  .map( line => line.replace( "\\", "\\\\" ) ) // TODO Convert "\" to "\\"
                  .join( "\\n" ) + "\x04\xC2"
      }
      text.push( quotes(item.org) + "\t" + descr )
    }
    if( this.size ) {
      await this._write( text )
    } //else console.log( "Nothing to save?" );

    return this;
  },

  parse( text : string ) {
    console.assert( this, "!!" )
    console.assert( !!text && text.length, "!!" )

    const lines = text.split( /[\n\r]+/ )

    //console.log( "Parsing", "\ntext:", text, "\n\nlines:", lines, "\n\n" )
    for( const line of lines ) {
      var parsed = /^\s*(?:"([^"]+)"|([^"\s]+))[\s]+(.*)$/.exec(line) || [],
          fname  = parsed[1] || parsed[2],
          fdescr = parsed[3]
      //TODO convert "\n" to lines, "\\" to "\"
      //console.assert( !fname.contains('"'), "!!" );
      //console.log( indx + ":+\t" + line, "\n\tx=", x, "\n\tfname=", fname, "\n\tfdescr=", fdescr, "\n\t.size=", this.size );
      if( !!fname ) {
        this.set( fname, fdescr )
      }
    }
    if( text !== "" && this.size === 0 ) { // Loaded but something wrong?
      console.log( "WTF? text=`" + text + "`, size=0!" )
      for( const [i, line] of Object.entries(lines) ) {
        console.log( i + ":\t" + line )
      }
    }
    //console.log( "Found " + this.size + " item(s)" )

    return this;
  },

  get( fname : string ) {
    return this._entries.get( fname.toLowerCase() );
  },
  set( fname: string, descr : string ) {
    if( !!descr ) {
      this._entries.set( fname.toLowerCase(), { org: fname, descr } ) // TODO Preserve "real" filename if already?
    } else {
      this._entries.delete( fname.toLowerCase() ) // TODO Preserve "real" filename if already?
    }

    return this;
  },
}

function DescriptIONs() {
  const obj = Object.create( PROTO,
                             { _entries: new Map(),
                               _dir: "",
                             } )
  return obj;
}

export {
  DESCRIPT_ION,
  DescriptIONs,
};

// TODO
// [ ] Better real filenames in DESCRIPT_IONs
