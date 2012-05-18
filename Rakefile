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

# TODO: convert this to use sprockets, or rake-pipeline
require File.dirname(__FILE__) + "/lib/builders/compiler"
namespace :compile do
  desc "Compile wheel_base.js manifest"
  task :base do
    Wheel::Compiler.make "wheel_base"
  end

  desc "Compile wheel_app_jquery.js manifest"
  task :jquery do
    Wheel::Compiler.make "wheel_app_jquery"
  end

  desc "Compile wheel_app_jquery.js manifest"
  task :zepto do
    Wheel::Compiler.make "wheel_app_zepto"
  end

  desc "Compile all the manifests"
  task :all do
    Rake::Task["compile:base"].execute
    Rake::Task["compile:zepto"].execute
    Rake::Task["compile:jquery"].execute
  end
end

namespace :play do
  desc "Move all js to the local rails app"
  task :copy do
    `rm -rf rails_app/vendor/assets/javascripts`
    `cp -r vendor/ rails_app/vendor/assets`
    `cp -r lib/wheel rails_app/vendor/assets/javascripts`
  end
end

