"use strict" // @flow

const DIRECTIONS = {
          N:  "N",
          NE: "NE",
          E:  "E",
          SE: "SE",
          S:  "S",
          SW: "SW",
          W:  "W",
          NW: "NW",
}

// Aliases:
DIRECTIONS.up    = DIRECTIONS.N
DIRECTIONS.down  = DIRECTIONS.S
DIRECTIONS.left  = DIRECTIONS.W
DIRECTIONS.right = DIRECTIONS.E

const UI_ORIENTATIONS = {
          portrait:  "portrait",
          landscape: "landscape",
}
const UI_POS = {
          left:   "left",
          right:  "right",
          top:    "top",
          bottom: "bottom",
          inside: "inside",
}
// Aliases:
UI_POS.above = UI_POS.top
UI_POS.below = UI_POS.bottom

const VALIDATE = {
          none:   "none",
          neutral: "neutral",
          success: "success",
          warning: "warning",
          error:   "error",
}

export {
  DIRECTIONS,
  UI_ORIENTATIONS, UI_POS,
  VALIDATE,

  //MB_ACCEPT_CANCEL, MB_ALWAYS_ONCE_NEVER,
};
