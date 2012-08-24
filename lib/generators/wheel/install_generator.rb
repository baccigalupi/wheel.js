class WheelGenerator < Rails::Generators::Base
  source_root File.expand_path('../../../../', __FILE__) # the root of the project

  def install
    directory 'src', 'vendor/assets/javascript/wheel/src'
    directory 'vendor', 'vendor/assets/javascript/wheel/vendor'
    directory 'dist', 'vendor/assets/javascript/wheel/dist'
    directory 'manifests', 'vendor/assets/javascript/wheel/manifests'
  end
end
