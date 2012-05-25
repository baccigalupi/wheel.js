//= require ../vendor/modernizr/modernizr.custom.js
//
//= require ../namespace.js
//= require ../mixins/events.js
//= require ../mixins/ajax.js
//= require ../class.js
//= require ../class/singleton.js
//= require ../utils/loader.js
//= require ../utils/connection_checker.js
//= require ../utils/request_queue.js
//= require ../app.js

Modernizr.load({
  test: Wheel.Utils.Loader.canZepto(),
  yep:  'assets/wheel/manifests/zepto_view.js',
  nope: 'assets/wheel/manifests/jquery_view.js',
  both: 'assets/application.js'
});
