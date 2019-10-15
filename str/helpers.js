"use strict" // @flow

function text( strs : string[], ...args : any[] ) : string { // TODO Returns the text with adjusted indentation
  let skip = maxint
  for( const str of strs ) {
    let indent = str.split(/[^ ]/, 1 )[0],
        spaceCount = indent.length
    console.assert( !indent.includes("\t"), "NOT IMPLEMENTED!!" )
    if( spaceCount < skip ) skip = spaceCount
  }
  let result = strs[0].slice(skip)
  for( const [i, arg] of args.entries() ) {
    result += String( arg )
    result += strs[i + 1].slice(skip)
  }
  return result;
}
