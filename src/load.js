// This should not be auto compressed. That way developers
// can set the paths to the files as they please.
Modernizr.load({
  test: Wheel.Utils.Loader.canZepto(),
  yep:  'wheel_modern.js',
  nope: 'wheel_legacy.js',
  both: 'app.js',
  complete: function() {
    Wheel.App.start(); // yup, this will build any subclasses of Wheel.App
  }
});
