"use strict" // @flow

//import through from "through2"
//import path from "path"
//import fs from "fs"
//import resolve from "resolve"

var through = require("through2")
var path = require("path")
var fs = require("fs")
var resolve = require("resolve").sync

const cwd = process.cwd()

function transformer( file, options = {} ) {
  const userlib = options.userlib || "jrg"
  return through(
      function( text, encoding, next ) {
          console.warn( `browserify-transform-userlib: replacing ${userlib} on ${file}` )
          const replaced = text
                             .toString( "utf8" )
                             .replace( RegExp( `"(${userlib})(/[^"]+|)`, "g" ), (match, p1, p2, ofs, whole) => {
          //const realpath = fs.realpathSync( resolve( `${cwd}/node_modules/${p1}${p2}` ) )
          //console.warn( `${file} ~> ${realpath}` )
                                  //return '"' + path.relative( file, fs.realpathSync( resolve( `${cwd}/node_modules/${p1}${p2}` ) ) );
                                  return '"' + fs.realpathSync( resolve( `${cwd}/node_modules/${p1}${p2}` ) );
                             } )
          //if( replaced.match( RegExpr ) ) {
          //  fs.appendFileSync("wtf", replaced.toString() )
          //}
          this.push( replaced )
          next()
      }
  );
}

module.exports = transformer;
