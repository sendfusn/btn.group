# frozen_string_literal: true

require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

def initialized_server?
  defined?(Rails::Server) || (defined?(::Puma) && File.basename($PROGRAM_NAME).starts_with?('puma')) ||
    (defined?(::Nack::Server) && File.basename($PROGRAM_NAME).starts_with?('nack')) # nack is Pow
end

module PayMeCrypto
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1
    config.active_job.queue_adapter = :sidekiq
    config.after_initialize do
      SecretFinanceStakingPoolsJob.perform_now if initialized_server? && Rails.env.production?
    end
  end
end
