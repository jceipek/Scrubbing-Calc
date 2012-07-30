// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by the LGPL, which can be found in the
// COPYING.LGPL file.
//
// Parts Copyright (C) 2011-2012, Alex Russell (slightlyoff@chromium.org)

(function(c) {
"use strict";

var multiplier = 1000;

c.SymbolicWeight = c.inherit({
  initialize: function(/*w1, w2, w3*/) {
    this.value = 0;
    var factor = 1;
    for (var i = arguments.length - 1; i >= 0; --i) {
      this.value += arguments[i] * factor;
      factor *= multiplier;
    }
  },

  valueOf: function() {
    return this.value;
  },

  toJSON: function() {
    return JSON.stringify({
      "class": "c.SymbolicWeight",
      "value": this.value
    });
  },
});

c.SymbolicWeight.clsZero = new c.SymbolicWeight(0, 0, 0);

var className = "c.SymbolicWeight";
c._json_receivers[className] = function(obj) {
  if (obj.value && obj.class == className) {
    var sw = new c.SymbolicWeight();
    sw.value = obj.value;
    return sw;
  }
};

})(c);
