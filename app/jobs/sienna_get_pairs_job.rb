# frozen_string_literal: true

require 'rest-client'

class SiennaGetPairsJob < ApplicationJob
  after_perform do |_job|
    run_time = Time.zone.now + 5.minutes
    SiennaGetPairsJob.set(wait_until: run_time).perform_later unless SiennaGetPairsJob.scheduled?
  end

  def perform
    response = RestClient.get 'https://ethereumbridgebackend.azurewebsites.net//secretswap_pairs/'
    swap_pairs = JSON.parse(response.body)['pairs']
    swap_pairs.each do |swap_pair|
      process_swap_pair_json(swap_pair)
    end
  end

  def process_swap_pair_json(swap_pair_json)
    return unless (pool_smart_contract = SmartContract.find_by(address: swap_pair_json['contract_addr']))

    pool = Pool.find_or_initialize_by(smart_contract_id: pool_smart_contract.id)
    pool.update!(protocol: Protocol.find_by(identifier: 'sienna')) unless pool.persisted?
    pool.update!(category: 'trade_pair') if pool.category.nil?
    return unless (token_zero = swap_pair_json['asset_infos'][0]['token'])
    return unless (token_one = swap_pair_json['asset_infos'][1]['token'])

    cryptocurrency_shares_token = Cryptocurrency.find_by(smart_contract: SmartContract.find_by(address: swap_pair_json['liquidity_token']))
    if cryptocurrency_shares_token.nil?
      Airbrake.notify("Cryptocurrency for smart contract #{swap_pair_json['liquidity_token']} missing")
      return
    end
    cryptocurrency_deposit_one = Cryptocurrency.find_by(smart_contract: SmartContract.find_by(address: token_zero['contract_addr']))
    if cryptocurrency_deposit_one.nil?
      Airbrake.notify("Cryptocurrency for smart contract #{token_zero['contract_addr']} missing")
      return
    end
    cryptocurrency_deposit_two = Cryptocurrency.find_by(smart_contract: SmartContract.find_by(address: token_one['contract_addr']))
    if cryptocurrency_deposit_two.nil?
      Airbrake.notify("Cryptocurrency for smart contract #{token_one['contract_addr']} missing")
      return
    end

    pool.cryptocurrency_pools
        .find_or_create_by!(cryptocurrency_role: 'shares',
                            cryptocurrency: cryptocurrency_shares_token)
    pool.cryptocurrency_pools
        .find_or_create_by!(cryptocurrency_role: 'deposit',
                            cryptocurrency: cryptocurrency_deposit_one)
    pool.cryptocurrency_pools
        .find_or_create_by!(cryptocurrency_role: 'deposit',
                            cryptocurrency: cryptocurrency_deposit_two)
  end
end
