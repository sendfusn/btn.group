# frozen_string_literal: true

require 'rest-client'

class SecretNetworkGetSmartContractsByCodeIdJob < ApplicationJob
  def perform(code_id, data_hash)
    contracts_for_code_id_response = RestClient.get "https://api.secretapi.io/wasm/code/#{code_id}/contracts"
    contracts_for_code_id = JSON.parse(contracts_for_code_id_response)['result']
    contracts_for_code_id&.each do |contract|
      SmartContract.find_or_create_by!(address: contract['address'],
                                       blockchain_id: Blockchain.find_by(identifier: 'secret_network').id,
                                       code_id: code_id,
                                       creator: contract['creator'],
                                       data_hash: data_hash,
                                       label: contract['label'])
    end
  end
end
