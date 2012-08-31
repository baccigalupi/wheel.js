var fs = require('fs');
var exec = require('child_process').exec;
var Step = require('step');

desc('Concat and minify the various distributions');
task('build', function () {
  console.log('building distributions');

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
      'vendor/javascripts/zepto/zepto.js',
      'src/zepto_shim.js'
    ],

    legacy: [
      'vendor/javascripts/jquery/jquery-1.7.1.js',
      'src/lib/cookie.js',
      'src/utils/storage_fill.js'
    ]
  };

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

  for( var name in manifests) {
    buildFile(name);
  }
});

namespace('bump', function() {
  var bump = function(i) {
    var splitter = '.';
    var version = fs.readFileSync('VERSION').toString();
    version = version.split(splitter);
    version[i] = (+version[i]) + 1;
    for (i++; i < version.length; i++) {
      version[i] = 0;
    }
    version = version.join(splitter).trim();

    console.log('bumping version to: ', version);

    // write back to VERSION
    var fileOut = fs.openSync('VERSION', 'w+');
    fs.writeSync(fileOut, version);

    // read update and write back to package.json
    var package = JSON.parse(fs.readFileSync("package.json").toString());
    package.version = version;
    fileOut = fs.openSync('package.json', 'w+');
    package = JSON.stringify(package, null, 2);
    fs.writeSync(fileOut, package);
  };

  desc('bump the major release number in the gem and package');
  task('major', function() {
    bump(1);
  });

  desc('bump the minor release number in the gem and package');
  task('minor', function() {
    bump(1);
  });

  desc('bump the patch release number in the gem and package');
  task('patch', function() {
    bump(2);
  });
});

task('gemspec', function() {
  console.log('creating the gemspec');
  exec('rake gemspec');
});

task('push', function() {
  console.log('Donig the git dance to github');
  Step(
    function() {
      exec('git add .', this);
    },
    function(err, text) {
      console.log(text);
      if (err) throw err;
      exec('git commit -m "release"', this)
    },
    function(err, text) {
      console.log(text);
      if (err) throw err;
      exec('git push', this);
    },
    function(err, text) {
      console.log(text);
      if (err) throw err;
    }
  );
});

namespace('release', function() {
  desc('build distributions; bump the patch version; create the gemspec; commit; and push to github');
  task('patch', function() {
    jake.Task['build'].invoke();
    jake.Task['bump:patch'].invoke();
    jake.Task['gemspec'].invoke();
    jake.Task['push'].invoke();
  });

  desc('build distributions; bump the minor version; create the gemspec; commit; and push to github');
  task('minor', function() {
    jake.Task['build'].invoke();
    jake.Task['bump:minor'].invoke();
    jake.Task['gemspec'].invoke();
    jake.Task['push'].invoke();
  });
});
