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
  gem.summary = %Q{MV* JavaScript framework for mobile and beyond}
  gem.description = %Q{MV* JavaScript framework making it easy to go from a little JavaScript with progressive inhancement to a one-page JS app.}
  gem.email = "baccigalupi@gmail.com"
  gem.authors = ["Kane Baccigalupi"]
  # dependencies defined in Gemfile
end
Jeweler::RubygemsDotOrgTasks.new

task :default => :jasmine
