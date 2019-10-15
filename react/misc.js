"use strict" // @flow

function reactKey(key: ?string, defaultValue?: string): string {
  console.assert(this, "Use reactKey.call(this), etc" );
  console.assert( key || this.props, "reactKey should be used with a non-empty key or from a React component" );

  const result = this.displayName + ":" + (key || this.props.id || this.props.name || defaultValue);
  //vardump`${{result}}`;
  return result;
}

export {
  reactKey,
}
