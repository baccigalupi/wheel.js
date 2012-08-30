require 'rails/generators'
class WheelGenerator < Rails::Generators::Base
  source_root File.expand_path('../../../../', __FILE__) # the root of the project

  def install
    directory 'src',        'vendor/assets/javascripts/wheel/src'
    directory 'vendor',     'vendor/assets/javascripts/wheel/vendor'
    directory 'dist',       'vendor/assets/javascripts/wheel/dist'
    directory 'lib/generators/wheel/manifests', 'vendor/assets/javascripts/wheel/manifests'
  end
end
