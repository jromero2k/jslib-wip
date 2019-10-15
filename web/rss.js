"use strict" // @flow

import { EventEmitter } from "events"

type UserReaction = "thumbs_up"|"love"|"lol"|"wtf"|"sad"|"angry"

class RssItem {
  id: GUID // A unique string feed readers use to know if an item is new or has already been seen. If you use a guid never change it. If you don’t provide a guid then your item urls must be unique.
  title: ?string // Title of this particular item
  description: ?string // Content for the item. Can contain html but link and image urls must be absolute path including hostname
  link: string // Url to the item. This could be a blog entry
  author: ?string // the name of the item’s creator. If not provided the item author will be the same as the feed author. This is typical except on multi-author blogs.
  categories: ?string[] // If provided, each array item will be added as a category element
  published_at: Date // The date and time of when the item was created. Feed readers use this to determine the sort order. Some readers will also use it to determine if the content should be presented as unread.
  modified_at: ?Date // (eg, in case there was a revision of the original article)
  received_at: Date
  user: {
    is_read: boolean,
    is_deleted: boolean,
    is_flagged: boolean,
    reaction: ?UserReaction,
    tags: ?string,
    shared: integer,
    hilited: ?ItemRange[],
  }
  enclosure: { // podcasts, vodcasts, warez, etc
    url: string,
    size: integer,
    mime_type: string,
  }
  url_thumbnail: string
/**
  xml_base: string
  source_title: string
  source_xmlurl: string
  source_fd_postid: string
  source_fd_feedid: string
  media_thumbnail_url: string
  post_hash: integer
  user_like: integer
  num_likes: integer
  gr_original_id: string
  url_comments_html: string
  url_comments_xml: string
  orig_link: string
  is_translated: integer
  timestamp: TIMESTAMP

◾{ lat,    The latitude coordinate of the item
◾  long, } The longitude coordinate of the item
◾custom_elements[] optional array Put additional elements in the item (node-xml syntax)

  **/
}

type RssQuery = ?string
type FeedSelector = Array<integer|RssChannel>

class RssDB {
  constructor( channel: GUID ) {
  }
  close() {

  }
  select(query, cb) {

  }
}

class RssChannel {
  id: GUID
  title: string
  description: string
  type: "rss"
  url_rss: string // xmlUrl
  url_html: string // htmlUrl
  user: { }   // ignore_imgs should_prefetch purge_profile
              // is_collapsed
  extra: { }  // added_at numTotal last_posted_at
              // updated_at updated_status
              // numUnread numFlagged
              // att_clicks att_followedlinks att_shared
              // generator?
  update_freq: integer // in seconds
  next_update_at: Date // when it should update again

  update(): boolean {

  }
  stop(): boolean {

  }

  select( query : string|RssQuery ): RssItem[] {

  }
}
/*
  url_thumbnail: string
  categories: ?string[] // optional array of strings One or more categories this feed belongs to.
◾docs optional url string Url to documentation on this feed.
◾managingEditor optional string Who manages content in this feed.
◾webMaster optional string Who manages feed availability and technical support.
◾copyright optional string Copyright information for this feed.
◾language optional string The language of the content of this feed.
◾pubDate optional Date object or date string The publication date for content in the feed
◾ttl optional integer Number of minutes feed can be cached before refreshing from source.
◾hub optional PubSubHubbub hub url Where is the PubSubHub hub located.
◾custom_namespaces optional object Put additional namespaces in  element (without ‘xmlns:’ prefix)
◾custom_elements optional array Put additional elements in the feed (node-xml syntax)
*/
class RssFolder {
  children: RssFolder[] | integer[] // indices @ .feeds[]
  caption: string
  extra: { } // user_disabled user_notify user_prefetch user_style
             // att_enabled
  defaults: {
    update_freq: integer // in s
    //purge_rules:
  }
}

type RssResult = {
  channel: integer, // index @ .feeds[]
  item: GUID|RssItem,
}

class RssFeeds {
  feeds: RssChannel[]
  tree: RssFolder

//  toJSON(key): string {
//    return JSON.stringify( { feeds, tree }, null, "\t" )
//  }
  load(json: string) {
    const _saved = JSON.parse( json )
  }

  //add( items: RssChannel[] ): integer {
  add( item: string, options = {} ): integer {
    const { } = options
  }
  del( idx: integer ): boolean {

  }

  indexOf( what: ?string|RegExp|FnFilter, startIndex: ?integer ): integer {
    let result,
        matcher
    switch( what ) {
      case "string":
        matcher = (feed) => undefined
      case "regex":
        matcher = (feed) => undefined
      case "fn":
        matcher = (feed) => undefined
    }
    const feed = this.feeds.findIndex( matcher )
    if( feed ) {
      return ;
    }
  }

  update( indices: ?FeedSelector ): boolean {

  }
  stop( indices: ?FeedSelector ): boolean {

  }

  select( query: string|RssQuery ): RssFeeds {
    if( query === "shouldUpdate" ) {
      const now = +Date()
      return this.feeds.filter( feed => feed.next_update_at <= now ) // update is overdue?
    }
  }
}

export {
  RssFeeds,
  RssFolder,
  RssChannel,
  RssItem,
};
