"use strict" // @flow

type SettingType =
  | "Unknown"
  | "Page" | "Group"
  | "String" | "Boolean"
  | "Number" | "Cardinal" | "Integer" | "Currency" | "Float"
  | "DateTime" | "Date" | "Time"
  | "Choice" | "CheckList"
  | "FilePath" | "Files" | "FolderPath" | "Folders" | "URL"
  | "Memo" | "MarkdownMemo" | "RichMemo"
  | "KeyCombos"
  | "Tags"

interface Setting {
  type : SettingType,
  shortName : string,
  caption : string,
  path : string,
  mirrors : null | string[], // other places this setting shows up
  tags : string[], // eg. [admin], [hidden],
  expertise : integer, // 0 ~> total newbie, 255 ~> uberhacker
}

interface SettingsContainer extends Setting {
  children : Setting[],
}

interface SettingsPage extends SettingsContainer {
}

function fullPath( setting : Setting ) : string {
}
function fullName( setting : Setting ) : string {
}
function root( setting : Setting ) : SettingsContainer {
}
function page( setting : Setting ) : SettingsContainer {
}
function container( setting : Setting ) : SettingsContainer {
}

export {
  SettingType,
  Setting,
  SettingsContainer,
  SettingsPage,
};
