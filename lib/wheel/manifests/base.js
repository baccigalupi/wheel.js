//= require ../vendor/javascripts/modernizr/modernizr.custom.js
//= require ../vendor/javascripts/mustache/mustache
//
//= require ../namespace.js
//= require ../mixins/events.js
//= require ../mixins/ajax.js
//= require ../class.js
//= require_tree ../class
//= require ../utils/loader.js
//= require ../utils/connection_checker.js
//= require ../utils/request_queue.js
//= require ../app.js
//= require ../utils/testers
//= require ../templates
//= require ../view
//= require ../event_managers/event_manager
//= require_tree ../event_managers
//= require ../model.js

Modernizr.load({
  test: Wheel.Utils.Loader.canZepto(),
  yep:  'assets/wheel/vendor/javascripts/zepto/zepto-1.0rc1.js',
  nope: 'assets/wheel/vendor/javascripts/jquery/jquery-1.7.1.js',
  both: 'assets/app.js',
  complete: function() {
    // Build the app subclass(es)
  }
});
