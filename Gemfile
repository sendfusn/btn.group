# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.0.2'

gem 'actionpack', '>= 6.1.4.2'
gem 'activeadmin'
gem 'airbrake'
# For ruby metrics
gem 'barnes'
# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.6', require: false
gem 'cloudinary'
gem 'devise'
# Barebones two-factor authentication with Devise
gem 'devise-two-factor'
# Provides Haml generators for Rails 4 etc
gem 'haml-rails', '~> 2.0'
# Foreign key migration generator for Rails (Using in Semaphore also)
gem 'immigrant'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'
gem 'nokogiri', '>= 1.12.5'
gem 'pg'
# Use Puma as the app server
gem 'puma', '>= 5.5.1'
gem 'rack-cors'
# Recommended by Heroku: https://devcenter.heroku.com/articles/h12-request-timeout-in-ruby-mri
gem 'rack-timeout', require: 'rack/timeout/base'
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 6.1.4'
gem 'rails_autoscale_agent'
gem 'rails-reverse-proxy'
# Use Redis adapter to run Action Cable in production
gem 'redis'
# Use SCSS for stylesheets
gem 'sass-rails'
# Simple, efficient background processing for Ruby
gem 'sidekiq', '>= 6.4.0'
# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker', '~> 5.0'

group :development do
  # Guard::RSpec automatically run your specs
  gem 'guard-rspec'
  gem 'listen', '~> 3.3'
  # Display performance information such as SQL time and flame graphs for each request in your browser.
  # Can be configured to work on production as well see: https://github.com/MiniProfiler/rack-mini-profiler/blob/master/README.md
  gem 'rack-mini-profiler', '~> 2.0'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
end

group :development, :test do
  gem 'factory_bot_rails'
  gem 'haml_lint', require: false
  # Behaviour Driven Development for Ruby
  gem 'rspec-rails'
  # A Ruby static code analyzer and formatter, based on the community Ruby style guide.
  gem 'rubocop', require: false
  gem 'rubocop-performance'
  gem 'rubocop-rails'
  gem 'rubocop-rspec'
  gem 'scss_lint', require: false
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara'
  gem 'database_cleaner-active_record'
  gem 'selenium-webdriver'
  # Collection of testing matchers extracted from Shoulda
  gem 'shoulda-matchers', require: false
  # Easy installation and use of web drivers to run system tests with browsers
  gem 'webdrivers'
end
