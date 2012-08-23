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
  yep:  'assets/modern.js',
  nope: 'assets/legacy.js',
  both: 'assets/app.js',
  complete: function() {
    Wheel.App.start();
  }
});
