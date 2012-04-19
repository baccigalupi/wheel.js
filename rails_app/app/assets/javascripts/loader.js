// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require modernizr/modernizr.custom
//
//= require wheel/namespace
//= require wheel/class
//= require wheel/loader
//= require wheel/view

Modernizr.load({
  test: Wheel.Loader.canZepto(),
  yep:  'assets/zepto/zepto-1.0rc1.js',
  nope: 'assets/jquery/jquery-1.7.1.js',
  both: 'assets/application.js'
});
