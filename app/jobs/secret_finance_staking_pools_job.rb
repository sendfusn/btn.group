# frozen_string_literal: true

require 'rest-client'

class SecretFinanceStakingPoolsJob < ApplicationJob
  after_perform do |_job|
    run_time = Date.tomorrow.midnight.advance(hours: 4)
    SecretFinanceStakingPoolsJob.set(wait_until: run_time).perform_later unless SecretFinanceStakingPoolsJob.scheduled?
  end

  def perform
    response = RestClient.get 'https://api-bridge-mainnet.azurewebsites.net/rewards',
                              { params: { page: 0, size: 1000 } }
    staking_pools = JSON.parse(response.body)['pools']
    staking_pools.each do |staking_pool|
      process_pool_json(staking_pool)
    end

    # PAGE PARAM IS NOT WORKING FROM THE API PROVIDER
    # get_staking_pools = true
    # page = 0
    # while get_staking_pools
    #   response = RestClient.get 'https://api-bridge-mainnet.azurewebsites.net/rewards',
    #                             { params: { page: page, size: 1000 } }
    #   # Later on, send an airbrake error if this isn't 200 because we want to know about it
    #   if response.code == 200
    #     staking_pools = JSON.parse(response.body)['pools']
    #     if staking_pools.count.positive?
    #       staking_pools.each do |staking_pool|
    #         process_pool_json(staking_pool)
    #       end
    #       page += 1
    #     else
    #       get_staking_pools = false
    #     end
    #   else
    #     get_staking_pools = false
    #   end
    # end
  end

  def process_pool_json(pool_json)
    pool_smart_contract = SmartContract.find_or_initialize_by(address: pool_json['pool_address'])
    unless pool_smart_contract.persisted?
      secret_network_blockchain = Blockchain.find_or_create_by(name: 'secret network')
      pool_smart_contract.update(blockchain: secret_network_blockchain)
    end
    protocol = Protocol.where('lower(name) = ?', 'secret finance').first
    pool = Pool.find_or_initialize_by(protocol: protocol, smart_contract: pool_smart_contract)
    pool.update!(deadline: pool_json['deadline'].to_i,
                 pending_rewards: pool_json['pending_rewards'].to_i,
                 total_locked: pool_json['total_locked'].to_i)
    return if pool.cryptocurrency_pools.present?

    incentivized_token_cryptocurrency = process_token_json(pool_json['inc_token'])
    reward_token_cryptocurrency = process_token_json(pool_json['rewards_token'])
    pool.cryptocurrency_pools.create(cryptocurrency: incentivized_token_cryptocurrency, cryptocurrency_role: :deposit)
    pool.cryptocurrency_pools.create(cryptocurrency: reward_token_cryptocurrency, cryptocurrency_role: :reward)
  end

  def process_token_json(token_json)
    smart_contract = SmartContract.find_or_initialize_by(address: token_json['address'].downcase)
    unless smart_contract.persisted?
      secret_network_blockchain = Blockchain.find_or_create_by(name: 'secret network')
      smart_contract.update(blockchain: secret_network_blockchain)
    end
    cryptocurrency = Cryptocurrency.find_or_initialize_by(smart_contract: smart_contract)
    unless cryptocurrency.persisted?
      cryptocurrency.update(decimals: token_json['decimals'], name: token_json['name'], symbol: token_json['symbol'],
                            price: token_json['price'])
    end
    cryptocurrency
  end
end
