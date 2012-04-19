# encoding: utf-8

require 'rubygems'
require 'bundler'
begin
  Bundler.setup(:default, :development)
rescue Bundler::BundlerError => e
  $stderr.puts e.message
  $stderr.puts "Run `bundle install` to install missing gems"
  exit e.status_code
end
require 'rake'
require 'uglifier'

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

task :default => :jasmine

desc 'Compile the wheel.js into one file'
task :compile do
  root_dir = File.dirname(__FILE__)

  source = '';
  source_dir = root_dir + "/lib"
  [
    source_dir + "/wheel.js",
    source_dir + "/wheel/mixins/ajax.js",
    source_dir + "/wheel/mixins/optionize.js",
    source_dir + "/wheel/view.js",
    source_dir + "/wheel/application.js",
    source_dir + "/wheel/touch_manager.js",
    source_dir + "/wheel/widgeteria/link.js",
    source_dir + "/wheel/widgeteria/ajax_link.js",
    source_dir + "/wheel/widgeteria/form.js"
  ].each do |path|
    source << File.read(path);
  end

  destination_path = root_dir + "/package/wheel."
  File.delete(destination_path + "min.js") if File.exist?(destination_path + "min.js");
  File.delete(destination_path + ".js") if File.exist?(destination_path + ".js");

  File.open(destination_path + ".js", 'w') do |f|
    f.write source
  end
  File.open(destination_path + "min.js", 'w') do |f|
    f.write Uglifier.compile(source)
  end
end

desc "Move current vendor js to test rails app vendor"
task :copy_js_to_test_app do
  `rm -rf rails_app/vendor/assets/javascripts`
  `cp -r vendor/ rails_app/vendor/assets`
  `cp -r lib/wheel rails_app/vendor/assets/javascripts`
end

