Wheel.Application = Wheel.Class.subclass({
  initialize: function() {
    var appName = this._class.identifier;
    if ( window[appName] ) {
      return;
    } else {
      this.init();
      window[appName] = this;
    }
  },

  init: function() {
    // make objects and run methods on those objects
    // needed for your app
  }
}, {
  identifier: 'WheelApp'
});

/*
 * Make your app go by just making a new instance:
 *
 * $(document).ready(function() {
 *  new WheelApp();
 * });
 *
 */

