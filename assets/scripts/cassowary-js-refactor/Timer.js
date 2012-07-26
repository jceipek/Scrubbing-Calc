// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by the LGPL, which can be found in the
// COPYING.LGPL file.
//
// Parts Copyright (C) 2011, Alex Russell (slightlyoff@chromium.org)

(function(scope, c) {
"use strict";

scope.Timer = c.inherit({
  initialize: function() {
    this._timerIsRunning = false;
    this._elapsedMs = 0;
  },

  Start: function() {
    this._timerIsRunning = true;
    this._startReading = new Date();
  },

  Stop: function() {
    this._timerIsRunning = false;
    this._elapsedMs += (new Date()) - this._startReading;
  },

  Reset: function() {
    this._timerIsRunning = false;
    this._elapsedMs = 0;
  }, 

  IsRunning : function() {
    return this._timerIsRunning;
  },

  ElapsedTime : function() {
    if (!this._timerIsRunning) {
      return this._elapsedMs/1000;
    } else {
      return (this._elapsedMs+(new Date()-this._startReading))/1000;
    }
  },
});

})(this, c);
