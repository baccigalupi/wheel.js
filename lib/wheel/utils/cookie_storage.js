/*
 * This is a polyfil for HTML5 Local or Session storage
 * It is inspired by the awesome gist by Remy Sharp: https://gist.github.com/350433
 * License: http://rem.mit-license.org
 */
//= require wheel/lib/cookie
Wheel.Utils.CookieStorage = Wheel.Class({
  init: function(name) {
    this.name = name;
    this._reset();
    this.deserialize();
  },

  key: function(i) {
    return this.keys[i]
  },

  clear: function() {
    this._reset();
    this.serialize();
  },

  getItem: function(key) {
    return this.data[key];
  },

  removeItem: function(key) {
    delete this.data[key];
    this.keys.splice(this.keys.indexOf(key),1);
    this.length = this.keys.length;
    this.serialize();
  },

  setItem: function(key, value) {
    this.data[key] = value+'';
    this.keys.push(key);
    this.length = this.keys.length;
    this.serialize();
  },

  _reset: function() {
    this.data = {};
    this.length = 0;
    this.keys = [];
  },

  serialize: function() {
    $.cookie(this.name, JSON.stringify(this.data), {expires: 365});
  },

  deserialize: function() {
    var cookieData = $.cookie(this.name);
    if ( cookieData && cookieData != '' ) {
      this.data = JSON.parse(cookieData);
      var key;
      for (key in this.data) {
        this.keys.push(key);
      }
      this.length = this.keys.length;
    }
  }
});
