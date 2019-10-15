"use strict" // @flow

var transformer = require("./browserify-transform-userlib")

module.exports = function( bundle, options = {} ) {
  bundle.pipeline.on( "file", (file) => {
    return transformer(file, options)
  } )
  //bundle.pipeline.get( "wrap" ).splice( 0, 1, transformer(bundle, options) )
}
