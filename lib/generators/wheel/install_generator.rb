class InstallDistGenerator < Rails::Generators::Base
  source_root File.expand_path('../../../../wheel.js', __FILE__)
  directory 'src', 'vendor/assets/javascript/wheel/src'
  directory 'vendor', 'vendor/assets/javascript/wheel/vendor'
  directory 'dist', 'vendor/assets/javascript/wheel/dist'
  directory 'manifests', 'vendor/assets/javascript/wheel/manifests'
end
