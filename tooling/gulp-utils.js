"use strict" // @flow

import fs from "fs"
import path from "path"

import del from "del"
import chalk from "chalk"

import gulp from "gulp"
import rename from "gulp-rename"
import util from "gulp-util"

type DevMode = "production" | "dev" | "test"

const options = {

  mode: ("dev": DevMode),

  globs: {
    all:     [ "**/*" ],
    less:    [ "**/*.less" ],
    sass:    [ "**/*.scss",
               "**/*.sass", ],
    css:     [ "**/*.css" ],
    js:      [ "**/*.js" ],
    jsx:     [ "**/*.jsx" ],
    fonts:   [ "**/*.ttf",
               "**/*.otf", ],
    "img/pix":      [ "**/*.jpg",
                      "**/*.png", ],
    "img/vectors":  [ "**/*.svg" ],
  },
  dir: {
    src: {
      html:    [ "html" ],
      img:     [ "img" ],
      fonts:   [ "fonts" ],
      css:     [ "css",
                 "thirdparty/*/css", ],
      js:      [ "js",
                 "thirdparty/*/js", ],
    },
    out: {
      html:    "dist/html",
      css:     "dist/css",
      fonts:   "dist/fonts",
      img:     "dist/img",
      js:      "dist/js",
    },
  },
}

function isDevMode() { return options.mode === "dev"; }
function isTestMode() { return options.mode === "test"; }
function isProduction() { return options.mode === "production"; }

function oglobs( dirs: string|string[], ...globs?: string[] ) {
  console.assert( dirs )
  if( !globs.length ) {
    let params = dirs.split(/[.|]/)
    dirs = params[0]
    globs = params.slice(1)
  }

  let result = [],
      flat_globs = []
  switch( typeof dirs ) {
//  case "object" :
//    for( const dir of dirs )
//   dirs = options.src.dirs[dirs]
    case "string" :
      dirs = options.src.dirs[dirs]
  }
  if( typeof dirs === "string" ) dirs = [dirs]

  // flatten the glob combos
  for( let glob of globs ) {
    if( typeof glob === "string" ) glob = options.globs[glob]
    flat_globs = flat_globs.concat( glob )
  }

  for( const dir of dirs ) {
    for( const glob of flat_globs ) {
      result.push( dir + "/" + glob )
    }
  }
//console.log( "-----oglobs=", result )
  return result;
}

function toFiles( files: string|string[] ) {
  if( typeof files === "string" ) files = [files]
  return files.map( (item, index) => path.relative( __dirname, path.normalize(item) ) ).join("\n    ")
}

function toString( obj: any, blacklist: Object ) {
  blacklist = blacklist || { _contents:0, sourcesContent:0, csslint:0, stat:0, mappings:0 }
  const result = JSON.stringify( obj, function( k, v ){ if( !( k in blacklist ) ) return v }, 1 )
  return result;
}

function logFile( file: any, blacklist: Object ) {
  console.log( "file", toString(file, blacklist) )
};

function logThis() {
  const result = util.noop()
  logFile( result )
  return result;
}

function pluginError( err: string|Error ){
  let msg: string, opts: Object

  if( typeof err === "string" ) {
    msg = err
  } else {
    // Use annotated message of ParseError if available.
    // https://github.com/substack/node-syntax-error
    msg = err.annotated || err.message
    // Copy original properties that PluginError uses.
    opts = {
      name:       err.name,
      stack:      err.stack,
      fileName:   err.fileName,
      lineNumber: err.lineNumber,
    }
  }

  return new util.PluginError( "GulpFile", msg, opts );
}

function readFile( filename: string ) : ?(string|Buffer) {
  const stream = fs.createReadStream( filename, { encoding: "utf8" } )
  return stream.read();
}

function writeFile( filename: string, contents: Buffer|string ) {
  const stream = fs.createWriteStream( filename, { } )
  if( typeof contents === "object" ) {
    contents = JSON.stringify( contents, null, 2 )
  }
  stream.write( contents )
  stream.end()
}

export {
  options,

  toString, toFiles,
  readFile, writeFile,

  oglobs,
  pluginError,

  logFile, logThis,

  isDevMode, isTestMode, isProduction,
};
