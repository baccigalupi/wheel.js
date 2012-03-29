Wheel.Application = Wheel.Class.subclass({
  initialize: function() {
    var appName = this._class.name;
    if ( window[app] ) {
      return;
    } else {
      this.init();
      window[app] = this;
    }
  },

  init: function() {
    // make objects and run methods on those objects
    // needed for your app
  }
}, {
  name: 'WheelApp'
});

/*
 * Make your app go by just making a new instance:
 *
 * $(document).ready(function() {
 *  new WheelApp();
 * });
 *
 */

