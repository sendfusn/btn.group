release: bin/rake db:migrate
worker: bundle exec sidekiq -C config/sidekiq.yml
web: bundle exec rails s
