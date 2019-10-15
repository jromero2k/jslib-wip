"use strict" // @flow

import App from "gracias/app"

function autoFilename( url : string|UrlRequest ) : FilePath {
  let result
  result = path.basename( url ).split( /[?/]/ )
  return path.resolve( options.dir || process.cwd(), filename )
}

App.fn( "urls.toFilename", autoFilename )

export {
  autoFilename,
};
