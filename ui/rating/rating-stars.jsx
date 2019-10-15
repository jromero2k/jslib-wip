"use strict" // @flow

import React from "react"

function bounded(value: number, min: number, max: number) : number {
  if(value < min) return min;
  if(value > max) return max;
  return value;
}
function coerced(value: number, precision: number) : number {
  return precision < 1
           ? Math.floor( value / precision ) * precision
           : Math.floor( value * precision ) / precision;
}

export type RatingStars$Props = {
    value: number,
    min: number,
    max: number,
    step: integer,
    precision: number,
    star: (idx: integer, value: any) => React$Node
  }

class RatingStars extends React.Component<RatingStars$Props> {
  static defaultProps = {
    value: 0,
    min: 0,
    max: 5,
    step: 1,
    precision: 0.5,
    star: (idx: integer, value: any): React$Node => {
      return (
          <span key={ reactKey.call(this, idx) }
                className="rating-star"
                data-value={ value } />
      )
    }
  }
  stars(): React$Node[] {
    const precision = this.props.precision,
          rating = coerced(this.props.value, precision),
          min = coerced(this.props.min, precision),
          max = coerced(this.props.max, precision),
          step = coerced(this.props.step, precision),
          result = []
    console.assert( (rating >= min ) && (rating <= max ), "" )

    for( let i = 0, len = max - min, value = rating; i < len; i++, value -= step) {
      const star = this.props.star.call(this, i, bounded(value, 0, step))
      result.push( star )
    }
    return result;
  }

  render() {
    return (
      <span { ...this.props } className={ cxx("rating rating-stars", this) } data-value={ this.props.value } >
        { this.stars() }
      </span>
    );
  }
}

export {
  RatingStars,
};
