// This should not be auto compressed. That way developers
// can set the paths to the files as they please.
Modernizr.load({
  test: Wheel.Utils.Loader.canZepto(),
  yep:  'assets/wheel/manifests/wheel_modern.js',
  nope: 'assets/wheel/manifests/wheel_legacy.js',
  both: 'assets/app.js', // or whatever the app manifest is that sets up your logic
  complete: function() {
    Wheel.App.start(); // yup, this will build any subclasses of Wheel.App
  }
});
