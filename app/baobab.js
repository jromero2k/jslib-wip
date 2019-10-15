"use strict" // @flow

import Baobab from "baobab"
import { App, i18n, } from "gracias/app"
import { toArray, } from "gracias/array"
import { DateTime, } from "gracias/dates"

type Baobab$PathItem = string|Number|Function

export type Baobab$Path = Array<Baobab$PathItem>
export type Data$Path = string|Baobab$Path

function dataPath( path: Data$Path ): ?Baobab$Path {
  switch( Object.classof( path ) ) {
    case "Undefined":
      return;
    case "String":
      path = String(path).split( /[.\/\\]/ )
    case "Array":
      break;
    default:
      path = [path]
  }
  console.assert( !(path: Baobab$Path).find( item => !( typeof item in { "string":1, "number":1, "function":1 } ) ) )
      // Those are the only allowed types in a Baobab path, afaik
      // TODO iirc a function is only allowed as the last item?
  return path;
}

// NOTE: App.data.xyz means these helpers, while App.db.xyz are Baobab's original fns

const DataHelpers = {
  path: dataPath,

  commit() {
    App.db.commit()
  },

  validate( path: Data$Path, fields: Arrayable, mapper?: FnMapKeyValue ) { // TODO
    if( !Array.isArray( fields ) ) {
      console.assert( typeof fields === "string" )
      fields = toArray( fields )
    }

    const cursor = App.data.select( path )

    let result = { valid : true, fields : {} }
    for( const field of fields ) {
      const value = cursor.get( field ),
            valid = !!value //!!
      result.fields[field] = { value, valid, error: valid ? ""
                                                          : "Field is empty" } //!!
      if( !valid ) {
        result.valid = false
      }
    }
    return result;
  },
  locate( path: Data$Path, value: any, options: ObjectHash = {} ) {
    const { field = "id", } = options

    console.assert( field )
    if( typeof value === "undefined" ) {
      return;
    }
    return App.db.select( ...dataPath(path), (item) => item && item[field] == value );
  },
  select( path: Data$Path, fn: ?Function ) {
    path = dataPath( path )
    console.assert( typeof fn in { "function":1, "undefined":1 } )
    if( fn ) {
      console.assert( path && path.push )
      path.push( fn )
    }
    return App.db.select( ...path );
  },
  unset( path: Data$Path ) {
    return App.db.unset( dataPath( path ) );
  },
  set( path: Data$Path, value: any ) { // Replaces the old value
    return App.db.set( dataPath( path ), value );
  },
  get( path: Data$Path ) {
    return App.db.get( dataPath( path ) );
  },
  serialize( path: Data$Path ) {
    return App.db.serialize( dataPath( path ) );
  },
  with( path: Data$Path, action: string, value: any ) {
    path = dataPath( path )
    if( !App.db.get( path ) ) {
      //vardump`creating ${{path}}`
      switch( action ) {
        case "update":
          App.db.set( path, {} )
          break;
        case "merge":
          App.db.set( path, [] )
      }
    }
    console.assert( this[action], `${ JSON.stringify(action) } not found!` )
    this[action]( path, value )
  },
  find( path: Data$Path, value: any, options: ObjectHash ): any {
    return App.data.locate( path, value, options ).get();
  },
  unshift( path: Data$Path, values: any[] ): any {
    return App.db.unshift( dataPath( path ), values );
  },
  push( path: Data$Path, value: any ): any {
    if( !Array.isArray( value ) ) {
      return App.db.push( dataPath( path ), value );
    }
    return App.db.concat( dataPath( path ), value );
  },
  update( path: Data$Path, value: any ): any {
    console.assert( !Array.isArray( value ) )
    const _path = dataPath( path )
    return App.db.deepMerge( _path, value );
  },
  shallowUpdate( path: Data$Path, value: any ): any { // Adds/overwrites path with specified properties
    console.assert( !Array.isArray( value ) )
    const _path = dataPath( path )
    return App.db.merge( _path, value );
  },
  merge( path: Data$Path, values: any[], { uid = "id", doAddNew = true, doUpdateExisting = true } = {} ): any {
    console.assert( doUpdateExisting || doAddNew, "Needs some more work, eh?" )
    // TODO? use something like {operation} =
    //   update ~> doAddNew=false, doUpdateExisting=true
    //   extend ~> doAddNew=true, doUpdateExisting=false
    //   merge ~> doAddNew=true, doUpdateExisting=true, depth=0
    //   deepMerge ~> doAddNew=true, doUpdateExisting=true, depth=all
    console.assert( Array.isArray( values ) )

    const _path = dataPath( path )

    let oldValues = App.db.get( _path )
    if( typeof oldValues === "undefined" ) {
      //vardump`Initializing ${{_path}}`
      App.db.set( _path, oldValues = [] )
    }
    console.assert( Array.isArray(oldValues) )

    const indexMap = App.indexes[_path] // We're assuming that our index will stay fresh and will not be modified from somewhere else
                || ( App.indexes[_path] = new Map( map( oldValues.entries(), ( [k, v] ) => [v[uid], k] ) ) ) // ie, given arr[idx]={id:xyz,...} ~> makes sure that indexMap[xyz] = idx

    for( const [k, v] of values.entries() ) {
      let pos = indexMap.get( v[uid] )
      if( pos != null ) {
        if( doUpdateExisting ) {
          App.db.set( [..._path, pos], v )
        }
      } else {
        if( doAddNew ) {
          pos = oldValues.length
          App.db.push( _path, v )
          indexMap.set( v[uid], pos ) // Update index
        }
      }
    }
    //return "something"

    function* map( iterable, fn ) { // TODO put this in "jrg/iter"
      for( const value of iterable ) {
        yield fn( value );
      }
    }
  },
}

App.mixin( {
  data: DataHelpers,
} )

const monkey = Baobab.monkey

export {
  Baobab, monkey,
  DataHelpers,
};
