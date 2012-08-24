namespace :wheel do
  desc "Install wheel files into the vendor directory"
  task :install => :environment do
    `mkdir -p #{Rails.root}/vendor/assets/javascripts/wheel`
    `cp lib/wheel/ #{Rails.root}/vendor/assets/javascripts/wheel/`
  end
end
