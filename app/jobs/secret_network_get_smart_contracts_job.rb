# frozen_string_literal: true

require 'rest-client'

class SecretNetworkGetSmartContractsJob < ApplicationJob
  after_perform do |_job|
    run_time = Date.tomorrow.midnight.advance(hours: 12)
    SecretNetworkGetSmartContractsJob.set(wait_until: run_time).perform_later unless SecretNetworkGetSmartContractsJob.scheduled?
  end

  def perform
    response = RestClient.get 'https://api.secretapi.io/wasm/code'
    smart_contract_upload_codes = JSON.parse(response)['result']
    smart_contract_upload_codes.reverse_each do |code|
      SecretNetworkGetSmartContractsByCodeIdJob.perform_later(code['id'], code['data_hash'])
    end
  end
end
