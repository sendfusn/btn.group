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
      if initialized_server? && !Rails.env.test?
        Rails.application.load_seed
        CryptoPricesJob.set(wait_until: Time.zone.now + rand(1..300).minutes).perform_later unless CryptoPricesJob.scheduled?
        SecretNetworkCalculateAverageBlockTimeJob.perform_later unless SecretNetworkCalculateAverageBlockTimeJob.scheduled?
        SecretNetworkGetSmartContractsJob.set(wait_until: Time.zone.now + rand(1..300).minutes).perform_later unless SecretNetworkGetSmartContractsJob.scheduled?
        SecretFinanceStakingPoolsJob.set(wait_until: Time.zone.now + rand(1..300).minutes).perform_later unless SecretFinanceStakingPoolsJob.scheduled?
        SecretSwapGetPairsJob.set(wait_until: Time.zone.now + rand(1..300).minutes).perform_later unless SecretSwapGetPairsJob.scheduled?
        CalculateAprForYieldOptimizerBJob.set(wait_until: Time.zone.now + rand(1..300).minutes).perform_later unless CalculateAprForYieldOptimizerBJob.scheduled?
        SiennaGetPairsJob.set(wait_until: Time.zone.now + rand(1..300).minutes).perform_later unless SiennaGetPairsJob.scheduled?
      end
    end
  end
end
