# frozen_string_literal: true

require 'rest-client'

class SecretNetworkGetSmartContractsJob < ApplicationJob
  after_perform do |_job|
    run_time = Date.tomorrow.midnight.advance(hours: 12)
    SecretNetworkGetSmartContractsJob.set(wait_until: run_time).perform_later unless SecretNetworkGetSmartContractsJob.scheduled?
  end

  def perform
    response = RestClient.get "https://secret-4--lcd--archive.datahub.figment.io/apikey/#{Rails.application.credentials.datahub_api_key}/wasm/code"
    smart_contract_upload_codes = JSON.parse(response)['result']
    smart_contract_upload_codes.reverse_each do |code|
      SecretNetworkGetSmartContractInstancesJob.set(wait_until: Time.current + rand(60 * 24).minutes).perform_later(code['id'], code['data_hash'])
    end
  end
end
