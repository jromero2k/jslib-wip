"use strict" // @flow

const v4 = "(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}"
const v6 = "(?:(?:[0-9a-fA-F:]){1,4}(?:(?::(?:[0-9a-fA-F]){1,4}|:)){2,7})+"

const IP = function( opts = {} ) {
  return opts.exact ? new RegExp( '(?:^' + v4 + '$)|(?:^' + v6 + '$)' )
                    : new RegExp( '(?:' + v4 + ')|(?:' + v6 + ')', 'g');
};

IP.v4 = function( opts = {} ) {
  return opts.exact ? new RegExp('^' + v4 + '$')
                    : new RegExp(v4, 'g');
};

IP.v6 = function( opts = {} ) {
  return opts.exact ? new RegExp('^' + v6 + '$')
                    : new RegExp(v6, 'g');
};

export default IP;
