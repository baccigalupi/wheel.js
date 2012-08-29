# Generated by jeweler
# DO NOT EDIT THIS FILE DIRECTLY
# Instead, edit Jeweler::Tasks in Rakefile, and run 'rake gemspec'
# -*- encoding: utf-8 -*-

Gem::Specification.new do |s|
  s.name = "wheel.js"
  s.version = "0.3.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.authors = ["Kane Baccigalupi"]
  s.date = "2012-08-29"
  s.description = "MV* JavaScript framework tailored to Rails, making it easy to go from a little JavaScript with progressive inhancement to a one-page JS app."
  s.email = "baccigalupi@gmail.com"
  s.extra_rdoc_files = [
    "LICENSE.txt",
    "README.rdoc"
  ]
  s.files = [
    ".document",
    ".rspec",
    ".rvmrc",
    "Gemfile",
    "Gemfile.lock",
    "Jakefile.js",
    "LICENSE.txt",
    "README.rdoc",
    "Rakefile",
    "VERSION",
    "dist/wheel_base.js",
    "dist/wheel_base.min.js",
    "dist/wheel_legacy.js",
    "dist/wheel_legacy.min.js",
    "dist/wheel_light.js",
    "dist/wheel_light.min.js",
    "dist/wheel_modern.js",
    "dist/wheel_modern.min.js",
    "lib/generators/wheel/USAGE",
    "lib/generators/wheel/install_generator.rb",
    "lib/generators/wheel/manifests/loader.js",
    "lib/generators/wheel/manifests/wheel_base.js",
    "lib/generators/wheel/manifests/wheel_legacy.js",
    "lib/generators/wheel/manifests/wheel_modern.js",
    "lib/wheel.js.rb",
    "spec/javascripts/app_spec.js",
    "spec/javascripts/class/base_spec.js",
    "spec/javascripts/class/helper_spec.js",
    "spec/javascripts/class/inheritance_spec.js",
    "spec/javascripts/class/mix_and_mash_spec.js",
    "spec/javascripts/class/singleton_spec.js",
    "spec/javascripts/event_managment/mouse_manager_spec.js",
    "spec/javascripts/event_managment/touch_manager_spec.js",
    "spec/javascripts/helpers/spec_helper.js",
    "spec/javascripts/lib/cookies_spec.js",
    "spec/javascripts/mixins/ajax_spec.js",
    "spec/javascripts/mixins/draggable_spec.js",
    "spec/javascripts/mixins/events_spec.js",
    "spec/javascripts/mixins/storage_spec.js",
    "spec/javascripts/model_spec.js",
    "spec/javascripts/spec_runner.html",
    "spec/javascripts/support/jasmine.yml",
    "spec/javascripts/support/jasmine_config.rb",
    "spec/javascripts/support/jasmine_runner.rb",
    "spec/javascripts/templates_spec.js",
    "spec/javascripts/utils/connection_checker_spec.js",
    "spec/javascripts/utils/loader_spec.js",
    "spec/javascripts/utils/object_path_spec.js",
    "spec/javascripts/utils/pluralize_spec.js",
    "spec/javascripts/utils/request_queue_spec.js",
    "spec/javascripts/utils/storage_fill_spec.js",
    "spec/javascripts/utils/storage_spec.js",
    "spec/javascripts/utils/testers_spec.js",
    "spec/javascripts/utils/timed_queue_spec.js",
    "spec/javascripts/view_spec.js",
    "spec/javascripts/widgeteria/ajax_form_spec.js",
    "spec/javascripts/widgeteria/ajax_link_spec.js",
    "spec/javascripts/widgeteria/form_spec.js",
    "spec/javascripts/widgeteria/link_spec.js",
    "src/app.js",
    "src/banner.js",
    "src/class.js",
    "src/class/base.js",
    "src/class/singleton.js",
    "src/event_managers/event_manager.js",
    "src/event_managers/mouse_manager.js",
    "src/event_managers/touch_manager.js",
    "src/jasmine_heplers/to_be_a.js",
    "src/lib/cookie.js",
    "src/load.js",
    "src/mixins/ajax.js",
    "src/mixins/events.js",
    "src/mixins/storage.js",
    "src/model.js",
    "src/namespace.js",
    "src/templates.js",
    "src/utils/connection_checker.js",
    "src/utils/loader.js",
    "src/utils/object_path.js",
    "src/utils/pluralize.js",
    "src/utils/request_queue.js",
    "src/utils/storage.js",
    "src/utils/storage_fill.js",
    "src/utils/testers.js",
    "src/utils/timed_queue.js",
    "src/view.js",
    "src/widgeteria/ajax_form.js",
    "src/widgeteria/ajax_link.js",
    "src/widgeteria/form.js",
    "src/widgeteria/link.js",
    "vendor/javascripts/jquery/jquery-1.7.1.js",
    "vendor/javascripts/modernizr/modernizr-2.5.3.js",
    "vendor/javascripts/modernizr/modernizr.custom.js",
    "vendor/javascripts/mustache/mustache.js",
    "vendor/javascripts/zepto/zepto-1.0rc1.js",
    "wheel.js.gemspec"
  ]
  s.homepage = "http://github.com/baccigalupi/wheel.js"
  s.licenses = ["MIT"]
  s.require_paths = ["lib"]
  s.rubygems_version = "1.8.24"
  s.summary = "MV* JavaScript framework tailored to Rails"

  if s.respond_to? :specification_version then
    s.specification_version = 3

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<uglifier>, [">= 0"])
      s.add_development_dependency(%q<bundler>, ["~> 1.1.0"])
      s.add_development_dependency(%q<jeweler>, [">= 0"])
      s.add_development_dependency(%q<jasmine>, [">= 0"])
    else
      s.add_dependency(%q<uglifier>, [">= 0"])
      s.add_dependency(%q<bundler>, ["~> 1.1.0"])
      s.add_dependency(%q<jeweler>, [">= 0"])
      s.add_dependency(%q<jasmine>, [">= 0"])
    end
  else
    s.add_dependency(%q<uglifier>, [">= 0"])
    s.add_dependency(%q<bundler>, ["~> 1.1.0"])
    s.add_dependency(%q<jeweler>, [">= 0"])
    s.add_dependency(%q<jasmine>, [">= 0"])
  end
end

