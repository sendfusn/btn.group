# frozen_string_literal: true

require 'rest-client'

class SecretNetworkGetSmartContractInstancesJob < ApplicationJob
  def perform(code_id, data_hash)
    contracts_for_code_id_response = RestClient.get "https://secret-4--lcd--archive.datahub.figment.io/apikey/#{Rails.application.credentials.datahub_api_key}/wasm/code/#{code_id}/contracts"
    contracts_for_code_id = JSON.parse(contracts_for_code_id_response)['result']
    contracts_for_code_id&.each do |contract|
      sc = SmartContract.find_or_initialize_by(address: contract['address'])
      unless sc.persisted?
        sc.update(blockchain: Blockchain.find_by(identifier: 'secret_network'),
                  code_id: code_id,
                  creator: contract['creator'],
                  data_hash: data_hash,
                  label: contract['label'])
      end
    end
  end
end
