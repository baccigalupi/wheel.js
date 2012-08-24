/*
 * This is a polyfil for HTML5 Local or Session storage
 * It is inspired by the gist by Remy Sharp: https://gist.github.com/350433
 * License: http://rem.mit-license.org
 *
 * Can be used for general memory level or cookie level serialization, but more useful
 * for polyfilling HTML5 localStorag and SessionStorage. Those are created automatically
 * at the bottom of the file.
 *
 */
//= require wheel/lib/cookie
Wheel.Class('Wheel.Utils.StorageFill', {
  init: function() {
    this._reset();
    this.deserialize();
  },

  key: function(i) {
    return this.keys[i];
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

  serialize: function() {},
  deserialize: function() {}
}, {
  id: 'Wheel.Utils.StorageFill'
});

Wheel.Utils.CookieStorage = Wheel.Utils.StorageFill.subclass({
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

!window.localStorage &&   (window.localStorage =   new Wheel.Utils.CookieStorage({name:'localStorage'}));
!window.sessionStorage && (window.sessionStorage = new Wheel.Utils.StorageFill({name:'sessionStorage'}));
