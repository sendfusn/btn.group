# frozen_string_literal: true

# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: %i[get post patch put options]
  end
end

Rails.application.config.hosts << 'localhost'
Rails.application.config.hosts << 'www.btn.group'
Rails.application.config.hosts << 'btn.group'
