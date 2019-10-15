"use strict" // @flow

import React from "react"

import { i18n } from "gracias/i18n"

//import { reactKey } from "gracias/react/misc"
//import { classes as cx, addClasses as cxx } from "./useful.jsx"

import { DIRECTIONS,
          BsIcon } from "./ui.jsx"

function extract( pattern: string|RegExp ): string[] {
  if( pattern.classOf === "RegExp" ) {
    pattern = new RegExp( pattern, pattern.flags+ "u" )
  }

}

export type BsEmojied$Props = {
    text: string,
}
function BsEmojied( _props: BsEmojied$Props ) : React$Node {
  const { text, ...props } = _props,
        tokens = extract(/:[^:]+:/)
  switch(text) { // TODO
    case ":hi:":
      return ( <BsIcon className="emoji"
                       icon={ "#glyph-hi" } /> );
    default:
      return text;
  }
}

export type BsNoteEditor$Props = {
    text: string,
}
class BsNoteEditor extends React.Component<BsNoteEditor$Props> {
  render() {
    const { src, ...props } = this.props

    return <BsTextArea { ...props }
      />;
  }
}

export {
  BsMap,
};
