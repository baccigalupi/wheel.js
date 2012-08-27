
/*
 * Currently, all js files are expected to be available via the application's root url.
 * Also, the file where your app is packaged is expected to be /app.js at your domain.
 *
 * Override these locations according to your file setup.
 */
Modernizr.load({
  test: Wheel.Utils.Loader.canZepto(),
  yep:  'wheel_modern.js',
  nope: 'wheel_legacy.js',
  both: 'app.js',
  complete: function() {
    Wheel.App.start(); // yup, this will build any subclasses of Wheel.App
  }
});
