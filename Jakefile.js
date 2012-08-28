desc('Build the distributions, or pass in a particular name to just build that.');
task('build', [], function (params) {
  var manifests = {
    light: [
      'vendor/javascripts/modernizr/modernizr.custom.js',
      'vendor/javascripts/mustache/mustache.js',
      'src/namespace.js',
      'src/utils/object_path.js',
      'src/utils/testers.js',
      'src/mixins/events.js',
      'src/class.js',
      'src/class/base.js',
      'src/class/singleton.js',
      'src/utils/loader.js',
      'src/app.js',
      'src/templates.js',
      'src/view.js',
      'src/event_managers/event_manager.js',
      'src/event_managers/touch_manager.js',
      'src/event_managers/mouse_manager.js'
    ],

    base: [
      'vendor/javascripts/modernizr/modernizr.custom.js',
      'vendor/javascripts/mustache/mustache.js',
      'src/namespace.js',
      'src/utils/object_path.js',
      'src/utils/testers.js',
      'src/mixins/events.js',
      'src/mixins/ajax.js',
      'src/class.js',
      'src/class/base.js',
      'src/class/singleton.js',
      'src/utils/loader.js',
      'src/utils/connection_checker.js',
      'src/utils/request_queue.js',
      'src/app.js',
      'src/templates.js',
      'src/view.js',
      'src/event_managers/event_manager.js',
      'src/event_managers/touch_manager.js',
      'src/event_managers/mouse_manager.js'
    ],

    modern: [
      'vendor/javascripts/zepto/zepto-1.0rc1.js'
    ],

    legacy: [
      'vendor/javascripts/jquery/jquery-1.7.1.js',
      'src/lib/cookie.js',
      'src/utils/storage_fill.js'
    ]
  };

  var fs = require('fs');
  var parser = require('uglify-js').parser;
  var uglifier = require('uglify-js').uglify;
  var banner = fs.readFileSync('src/banner.js').toString();

  var buildFile = function(name) {
    var fileOut;
    var files = manifests[name];

    var all = '';
    files.forEach(function(file, i) {
      if (file.match(/^.*js$/)) {
        all += fs.readFileSync(file).toString();
      }
    });
    // write out the full concatenated code
    fileOut = fs.openSync('dist/wheel_'+ name + '.js', 'w+');
    fs.writeSync(fileOut, banner);
    fs.writeSync(fileOut, all);
    // add loader if appropriate
    var loader = '';
    if (name === 'base' || name === 'light') {
      loader += fs.readFileSync('src/load.js').toString();
    }
    fs.writeSync(fileOut, loader);

    // write out the minified code
    var ast = parser.parse(all);
    fileOut = fs.openSync('dist/wheel_'+ name + '.min.js', 'w+');
    fs.writeSync(fileOut, banner);
    ast = uglifier.ast_squeeze(ast);
    ast = uglifier.ast_mangle(ast);
    fs.writeSync(fileOut, uglifier.gen_code(ast));
    fs.writeSync(fileOut, loader);
  };

  if (params.name) {
    buildFile(params.name);
  } else {
    for( var name in manifests) {
      buildFile(name);
    }
  }
});
