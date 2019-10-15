"use strict" // @flow

import App from "gracias/app"

function uniqueFilename( pattern : string, dir: ?FilePath = process.cwd() ) : FilePath {
  let result = path.resolve( dir, pattern )
  return result;
}

App.fn( "fs.uniqueFilename", uniqueFilename )

export {
  uniqueFilename,
};
