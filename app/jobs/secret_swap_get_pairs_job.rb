# frozen_string_literal: true

require 'rest-client'

class SecretSwapGetPairsJob < ApplicationJob
  after_perform do |_job|
    run_time = Time.zone.now + 5.minutes
    SecretSwapGetPairsJob.set(wait_until: run_time).perform_later unless SecretSwapGetPairsJob.scheduled?
  end

  def perform
    response = RestClient.get 'https://api-bridge-mainnet.azurewebsites.net/secretswap_pairs',
                              { params: { page: 0, size: 1000 } }
    swap_pairs = JSON.parse(response.body)['pairs']
    swap_pairs.each do |swap_pair|
      process_swap_pair_json(swap_pair)
    end
  end

  def process_swap_pair_json(swap_pair_json)
    return unless (pool_smart_contract = SmartContract.find_by(address: swap_pair_json['contract_addr']))

    pool = Pool.find_or_initialize_by(smart_contract_id: pool_smart_contract.id)
    pool.update!(protocol: Protocol.find_by(identifier: 'secret_swap')) unless pool.persisted?
    pool.update!(category: 'trade_pair') if pool.category.nil?
    return unless (token_zero = swap_pair_json['asset_infos'][0]['token'])
    return unless (token_one = swap_pair_json['asset_infos'][1]['token'])
    return unless (cryptocurrency_shares_token = Cryptocurrency.find_by(smart_contract: SmartContract.find_by(address: swap_pair_json['liquidity_token'])))
    return unless (cryptocurrency_deposit_one = Cryptocurrency.find_by(smart_contract: SmartContract.find_by(address: token_zero['contract_addr'])))
    return unless (cryptocurrency_deposit_two = Cryptocurrency.find_by(smart_contract: SmartContract.find_by(address: token_one['contract_addr'])))

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
