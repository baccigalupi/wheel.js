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
    source_dir + "/mixins/ajax.js",
    source_dir + "/mixins/optionize.js",
    source_dir + "/view.js",
    source_dir + "/widgeteria/link.js",
    source_dir + "/widgeteria/ajax_link.js"
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

