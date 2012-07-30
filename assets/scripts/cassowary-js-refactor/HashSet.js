/**
 * Copyright 2011, Alex Russell <slightlyoff@google.com>
 *
 * Use of this source code is governed by the LGPL, which can be found in the
 * COPYING.LGPL file.
 *
 * API compatible re-implementation of jshashset.js, including only what
 * Cassowary needs. Built for speed, not comfort.
 */
(function(c) {
"use strict";

c.HashSet = c.inherit({

  initialize: function() {
    this.storage = [];
    this.size = 0;
  },

  add: function(item) {
    var s = this.storage, io = s.indexOf(item);
    if (s.indexOf(item) == -1) { s.push(item); }
    this.size = this.storage.length;
  },

  values: function() {
    // FIXME(slightlyoff): is it safe to assume we won't be mutated by our caller?
    //                     if not, return this.storage.slice(0);
    return this.storage;
  },

  delete: function(item) {
    var io = this.storage.indexOf(item);
    if (io == -1) { return null; }
    this.storage.splice(io, 1)[0];
    this.size = this.storage.length;
  },

  clear: function() {
    this.storage.length = 0;
  },

  each: function(func, scope) {
    this.storage.forEach(func, scope);
  },

  escapingEach: function(func, scope) {
    // FIXME(slightlyoff): actually escape!
    this.storage.forEach(func, scope);
  },

  toString: function() {
    var answer = this.size + " {";
    var first = true;
    this.each(function(e) {
      if (!first) {
        answer += ", ";
      } else {
        first = false;
      }
      answer += e;
    });
    answer += "}\n";
    return answer;
  },
});

})(c);
