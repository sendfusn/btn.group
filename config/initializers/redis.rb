# frozen_string_literal: true

# from https://devcenter.heroku.com/articles/heroku-redis#connecting-in-ruby
# https://help.heroku.com/HC0F8CUS/redis-connection-issues
$redis = Redis.new(url: ENV['REDIS_URL'], ssl_params: { verify_mode: OpenSSL::SSL::VERIFY_NONE })
