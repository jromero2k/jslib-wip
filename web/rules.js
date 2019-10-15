"use strict" // @flow

type RuleCondition = {
  kind: "value"|"regex"|"eval"|"event", // value ~> target[field] == expected
                                        // regex ~> /expected/.test(target[field])
                                        // eval ~> !!expected.call( target[field] )
                                        // event ~> .field ignored, .expected === "eventName"
  field: string, // The targeted field
  expected: any,
}

type RuleAction = {
  kind: "value"|"regex"|"eval", // value ~> target[field] = output
                                // regex ~> target[field] = /expected/.replace(target[field])
                                // eval ~>  target[field] = output.call(target[field])
  field: string,
  output: any,
}

class Rule {
  reqs: RuleCondition[]
  actions: RuleAction[]

  toJSON(key): string {
    for( test of tests ) {
      switch( test.kind ) {
        case "value":
        case "regex":
        case "eval":
      }
    }
    for( action of actions ) {
      switch( action.kind ) {
        case "value":
        case "regex":
        case "eval":
      }
    }
  }
  load(json: string) {
    const _saved = JSON.parse( json )

  }

  apply(item: Object): Object {
    //const result =
    return result;
  }
}

class DownloadRule extends Rule {

}

class DownloadRules {
  items : DownloadRule[]

  constructor() {
    this.items = []
  }

  toJSON(key): string {
    return JSON.stringify(items,null,2);
  }
  load(json: string) {
    const _saved = JSON.parse(json)
  }
}

class PurgingRule {
  // Keep n items only
  // Keep items newer than 15 days
  // Purge items matching this RexExp (vs body/title/)
}

export {
  RuleCondition, RuleAction, Rule,
  DownloadRules,
};

// Labeling function: fn(params) => { ...metadata } or null
