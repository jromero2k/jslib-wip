"use strict" // @flow

const KeyPositions = {
  "any":1,
  "left":1,
  "right":1,
  "extra":1,
}
const ModifierKeys = {
  "Ctrl":1,
  "Ctrl-Left":1,
  "Ctrl-Right":1,
  "Shift":1,
  "Shift-Left":1,
  "Shift-Right":1,
  "Alt":1,
  "Alt-Left":1,
  "Alt-Right":1,
  "Win":1,
  "Win-Left":1,
  "Win-Right":1,
}

export type ModifierKey = $Keys<typeof ModifierKeys>

const Keys = {
  "CAPS_LOCK":1,
  "ENTER":1,
  "ESC":1,
  "CTX_ACTION":1,
  "LEFT":1,
  "RIGHT":1,
  "UP":1,
  "DOWN":1,
  "BACKSPACE":1,
  "DELETE":1,
  "F1":1,
  "F2":1,
  "F3":1,
  "F4":1,
  "F5":1,
  "F6":1,
  "F7":1,
  "F8":1,
  "F9":1,
  "F10":1,
  "F11":1,
  "F12":1,
  "NUMPAD_PLUS":1,
  "NUMPAD_MINUS":1,
  "NUMPAD_STAR":1,
  "NUMPAD_SLASH":1,
  "NUMPAD_LEFT":1,
  "NUMPAD_RIGHT":1,
  "NUMPAD_UP":1,
  "NUMPAD_DOWN":1,
  "NUMPAD_HOME":1,
  "NUMPAD_END":1,
  "NUMPAD_PGUP":1,
  "NUMPAD_PGDOWN":1,
  "NUMPAD_INS":1,
  "NUMPAD_DEL":1,
  "NUMPAD_ENTER":1,
  "SPACE":1,
  "TAB":1,
}

export {
};
