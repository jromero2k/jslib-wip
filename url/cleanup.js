"use strict" // @flow

const DEFAULT_CLEANUPS = [
  /[\?&]utm_.+$/,         "",
  /&(?:src=longreads)/i,  "",
  /\?(?:src=longreads)/i, "?",
  /\?$/,                  "",
]

export type CleanUp$Options = {
  transforms?: any[], // FIXME Define it as [regex,str,regex,str...]
  noHttp?: boolean,
  noHash?: boolean,
}

function cleanUp( url: string, { transforms = DEFAULT_CLEANUPS,
                                  noHttp, noHash, }: CleanUp$Options = {} ) : string {
  console.assert( Array.isArray(transforms), "!!" )
  console.assert( (transforms.length & 1) == 0, "!!" )

  let result = url
  for( let len = transforms.length, i = 0; i < len; i = i + 2 ) {
    result = result.replace( transforms[i + 0], transforms[i + 1] )
  }
  return result;
}

export {
  DEFAULT_CLEANUPS,
  cleanUp,
};
