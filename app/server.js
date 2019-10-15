"use strict" // @flow

import React from "react"
import express from "express"

import { App, i18n, } from "gracias/app"

const Express = express()
const Route = express.Router()

export {
  React,
  Route,
  App,
  i18n,
}
