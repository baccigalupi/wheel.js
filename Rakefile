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

require 'jeweler'
Jeweler::Tasks.new do |gem|
  # gem is a Gem::Specification... see http://docs.rubygems.org/read/chapter/20 for more options
  gem.name = "wheel.js"
  gem.homepage = "http://github.com/baccigalupi/wheel.js"
  gem.license = "MIT"
  gem.summary = %Q{MV* JavaScript framework tailored to Rails}
  gem.description = %Q{MV* JavaScript framework tailored to Rails, making it easy to go from a little JavaScript with progressive inhancement to a one-page JS app.}
  gem.email = "baccigalupi@gmail.com"
  gem.authors = ["Kane Baccigalupi"]
  # dependencies defined in Gemfile
end
Jeweler::RubygemsDotOrgTasks.new

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

desc "Move assets to the wheelie asset package"
task :wheelie do
  `rm -rf ../wheelie/app/assets/javascripts/wheel`
  `cp -r ./lib/wheel/ ../wheelie/app/assets/javascripts/wheel`
  `cp -r ./vendor/javascripts/ ../wheelie/app/assets/javascripts/wheel/vendor`
end

namespace :play do
  desc "Move all js to the local rails app"
  task :copy do
    `rm -rf rails_app/vendor/assets/javascripts`
    `cp -r vendor/ rails_app/vendor/assets`
    `cp -r lib/wheel rails_app/vendor/assets/javascripts`
  end
end

