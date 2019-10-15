"use strict" // @flow

import React from "react"

import location from "./location"
import bus from "./bus"
import { matchAndParams, } from "./match"

function path_to_className(route: string): string {
  return route
            .replace(/^https?:\/\//g,"")
            .replace(/[/[?&#=.:;,\n\r]/g,"-")
            .replace(/--+/g,"-")
            .replace(/-$/g,"")
            .replace(/^-/g,"")
}
//console.warn( path_to_className("https://google.com/search?s=pepe&&lang=en-us") )

type Props = {
  route: string,
}
type State = {
  path: string,
  error: ?Object,
}
class ReactRoute extends React.Component<Props, state> {

  constructor( props ) {
    super( props )
    this.displayName = "Route"
    this.state = {
      path: location.pathname,
      error: null,
    }
  }

  handle_UrlChanged = (location,...params) => {
console.warn("url_changed", location, ...params )
    this.setState( { path: location ? (location.path||"") + (location.hash||"")
                                    : "", } ) // TODO
  }
  componentDidMount() {
    bus.on( "pushstate", this.handle_UrlChanged )
    bus.on( "popstate",  this.handle_UrlChanged )
  }

  componentDidCatch( error, info ) {
    console.error( error, info )
    this.setState( { error: { message: error, more: info, } } )
  }
  render() {
    const { route, ...props } = this.props,
          params = {}
    if(this.state.error) { //!! <
      const {stringify} = require("jrg/json")
      return <pre>{
        `${ this.state.error.msg }\n\n${ stringify(this.state.error.more,null,"  ").replace(/\\n/g,"\n") }`
      }</pre>;
    } //!! />

    const matched = matchAndParams( this.state.path, route, params )
if( matched ) console.warn( "path", this.state.path, "props", props, "params", params,  )
//console.warn( "path", this.state.path, "props", props, "params", params, "matched", matched, )
    if( !matched ) return null;

    const children = React.Children.map( props.children, child =>
      child.type
          ? React.cloneElement( child, Object.assign( { params }, { key: child.name }, child.props ) )
          : React.createElement( "span", {}, child )
    )

//console.warn( React.createElement( "div", { className: "route", key: route, }, children ) )
    return React.createElement( "div", { className: "route " + path_to_className(route) + " " + this.props.className, key: props.key || route, }, children );
  }
}

export default ReactRoute;
