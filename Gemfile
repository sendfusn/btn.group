# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.0.1'

gem 'airbrake'
gem 'cloudinary'
# Provides Haml generators for Rails 4 etc
gem 'haml-rails', '~> 2.0'
gem 'pg'
# Use Puma as the app server
gem 'puma', '~> 5.0'
gem 'rack-cors'
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 6.1.1'
gem 'rails-reverse-proxy'
# Use SCSS for stylesheets
gem 'sass-rails', '>= 6'
# Simple, efficient background processing for Ruby
gem 'sidekiq', '~> 6'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker', '~> 5.0'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.4', require: false

group :development do
  # Guard::RSpec automatically run your specs
  gem 'guard-rspec', '~> 4.7'
  gem 'listen', '~> 3.3'
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console', '>= 4.1.0'
  # Display performance information such as SQL time and flame graphs for each request in your browser.
  # Can be configured to work on production as well see: https://github.com/MiniProfiler/rack-mini-profiler/blob/master/README.md
  gem 'rack-mini-profiler', '~> 2.0'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
end

group :development, :test do
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
  gem 'capybara', '>= 3.26'
  gem 'selenium-webdriver'
  # Collection of testing matchers extracted from Shoulda
  gem 'shoulda-matchers', require: false
  # Easy installation and use of web drivers to run system tests with browsers
  gem 'webdrivers'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
