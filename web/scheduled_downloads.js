"use strict" // @flow

import log from "gracias/debug/log"

type SpeedLimit = ?integer // x<0 ~> Use profile #x;
                           // 0 ~> auto (eg, no override);
                           // x>0 ~> Max B/s, throttle if exceeded

type SpeedEval = () => { stale_after: ?integer, speed: integer }

type DownloadSchedule = {
  start_at: Date, //
  stop_at: ?Date,  // < 1yr ~> relative to start_at
  speed: SpeedLimit,
}

class ComplexSchedule {
  items : DownloadSchedule[] // There must be no ambiguity
}

type SpeedProfile = {

}

type SpeedProfiles = {

}

export {

};
