/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.3.0',
      banner: '/* Wheel.js - v<%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * http://github.com/baccigalupi/wheel.js\n' +
        ' * Copyright (c) 2011-<%= grunt.template.today("yyyy") %> ' +
        'Kane Baccigalupi; Licensed MIT: http://github.com/baccigalupi/wheel.js/LICENSE.txt */',
      baseBanner: '// Wheel base is the foundation step for loading a Wheel app. But there are two more files. If you let Wheel, it will take care of all this loading on its own.',
      legacyBanner: '// Wheel legacy file is for older browsers that require more code for bringing them into the present',
      modernBanner: '// Wheel modern file is for browsers that can do HTML5. It is slimmer and perfect for mobile.'
    },

    min: {
      light: {
        src: [
          '<banner:meta.banner>',
          'lib/wheel/vendor/javascripts/modernizr/modernizr.custom.js',
          'lib/wheel/vendor/javascripts/mustache/mustache.js',
          'lib/wheel/namespace.js',
          'lib/wheel/utils/testers.js',
          'lib/wheel/mixins/events.js',
          'lib/wheel/class.js',
          'lib/wheel/class/*.js',
          'lib/wheel/utils/loader.js',
          'lib/wheel/app.js',
          'lib/wheel/templates.js',
          'lib/wheel/view.js',
          'lib/wheel/event_managers/event_manager.js',
          'lib/wheel/event_managers/*.js'
        ],
        dest: 'dist/wheel_base_light.js'
      },
      base: {
        src: [
          '<banner:meta.banner>',
          'lib/wheel/vendor/javascripts/modernizr/modernizr.custom.js',
          'lib/wheel/vendor/javascripts/mustache/mustache.js',
          'lib/wheel/namespace.js',
          'lib/wheel/utils/testers.js',
          'lib/wheel/mixins/events.js',
          'lib/wheel/mixins/ajax.js',
          'lib/wheel/class.js',
          'lib/wheel/class/*.js',
          'lib/wheel/utils/loader.js',
          'lib/wheel/utils/connection_checker.js',
          'lib/wheel/utils/request_queue.js',
          'lib/wheel/app.js',
          'lib/wheel/templates.js',
          'lib/wheel/view.js',
          'lib/wheel/event_managers/event_manager.js',
          'lib/wheel/event_managers/*.js'
        ],
        dest: 'dist/wheel_base.js'
      },
      modern: {
        src: [
          '<banner:meta.banner>',
          'lib/wheel/vendor/javascripts/zepto/zepto-1.0rc1.js'
        ],
        dest: 'dist/wheel_modern.js'
      },
      legacy: {
        src: [
          '<banner:meta.banner>',
          'lib/wheel/vendor/javascripts/jquery/jquery-1.7.1.js',
          'lib/wheel/lib/cookie.js',
          'lib/wheel/utils/storage_fill.js'
        ],
        dest: 'dist/wheel_legacy.js'
      }
    },

    min: {
      light: {
        src: ['<banner:meta.banner>', '<config:concat.base.dest>'],
        dest: 'dist/wheel_base_light.min.js'
      },
      base: {
        src: ['<banner:meta.banner>', '<config:concat.base.dest>'],
        dest: 'dist/wheel_base.min.js'
      },
      modern: {
        src: ['<banner:meta.banner>', '<config:concat.modern.dest>'],
        dest: 'dist/wheel_modern.min.js'
      },
      legacy: {
        src: ['<banner:meta.banner>', '<config:concat.legacy.dest>'],
        dest: 'dist/wheel_legacy.min.js'
      }
    },

    jasmine: {
      all: {
        src:['specs/specrunner.html'],
        errorReporting: true
      }
    },

    lint: {
      files: ['grunt.js', 'lib/wheel/**/*.js', 'spec/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint concat min');
  // external
  grunt.loadNpmTasks('grunt-jasmine-task');
};
