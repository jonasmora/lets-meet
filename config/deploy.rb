set :application, "lets-meet"
set :domain, "outboxlabs.com"
set :user, "app"

set :scm, :git
set :keep_releases, 2
set :repository, "git@github.com:jonasmora/lets-meet.git"
set :branch, "master"
set :deploy_via, :remote_cache

server domain, :app, :web, :db, :primary => true

ssh_options[:user] = "app"
ssh_options[:forward_agent] = true

set :use_sudo, false

set :deploy_to, "/mnt/www/#{application}"

namespace :deploy do
  task :start do
    run "monit -d 60 start #{application}"
  end

  task :stop do
    run "monit stop #{application}"
  end

  task :restart do
    run "monit restart #{application}"
  end
end

namespace :monit do
  namespace :config do
    task :update do
      run "cp #{current_path}/deploy/monit/lets-meet.conf /etc/monit/conf.d/"
    end
  end
end

namespace :upstart do
  namespace :config do
    task :update do
      run "cp #{current_path}/deploy/upstart/lets-meet.conf /etc/init/"
    end
  end
end

namespace :npm do
  task :install do
    run "cd #{current_path} && npm install"
    
    if previous_release
      previous_modules = File.join(previous_release, 'node_modules')
      release_modules = File.join(release_path, 'node_modules')
      run "cp -r #{previous_modules} #{release_modules}"
    end

    run "cd #{release_path} && npm install"
  end
end

after "deploy:update", "npm:install"
