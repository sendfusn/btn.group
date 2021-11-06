# frozen_string_literal: true

require 'rest-client'

class SecretFinanceStakingPoolsJob < ApplicationJob
  after_perform do |_job|
    run_time = Time.zone.now + 1.hour
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
    return unless (pool_smart_contract = SmartContract.find_by(address: pool_json['pool_address']))

    pool = Pool.find_or_initialize_by(smart_contract_id: pool_smart_contract.id)
    pool.update!(deadline: pool_json['deadline'].to_i,
                 pending_rewards: pool_json['pending_rewards'].to_i,
                 protocol: Protocol.find_by(identifier: :secret_swap),
                 total_locked: pool_json['total_locked'].to_i)
    # EthereumBridgeFrontend/blob/master/src/components/Earn/EarnRow/index.tsx
    time_remaining_in_seconds = (pool.deadline - 128_730) * 6.22 + 1_632_380_505 - Time.zone.now.to_i
    price_of_rewards = pool_json['rewards_token']['price'].to_f
    pending_rewards_in_usd = pool.pending_rewards * price_of_rewards / 1_000_000
    locked_amount_in_usd = pool.total_locked * pool_json['inc_token']['price'].to_f / 10**pool_json['inc_token']['decimals']
    if locked_amount_in_usd.positive?
      apr = pending_rewards_in_usd * 100 * 31_540_000 / locked_amount_in_usd / time_remaining_in_seconds
      if apr.positive?
        pool.update(apr: apr.round(2))
        pool.pool&.update(apy: ((((1 + apr / 100 / 365)**365) - 1) * 100).round(2))
      else
        pool.update(apr: 0)
        pool.pool&.update(apy: 0)
      end
    end
    return if pool.cryptocurrency_pools.present?

    incentivized_token_cryptocurrency = process_token_json(pool_json['inc_token'])
    reward_token_cryptocurrency = process_token_json(pool_json['rewards_token'])
    pool.cryptocurrency_pools.create(cryptocurrency: incentivized_token_cryptocurrency, cryptocurrency_role: :deposit)
    pool.cryptocurrency_pools.create(cryptocurrency: reward_token_cryptocurrency, cryptocurrency_role: :reward)
  end

  def process_token_json(token_json)
    smart_contract = SmartContract.find_by(address: token_json['address'].downcase)
    return unless smart_contract

    cryptocurrency = Cryptocurrency.find_or_initialize_by(smart_contract: smart_contract)
    unless cryptocurrency.persisted?
      cryptocurrency.update(decimals: token_json['decimals'], name: token_json['name'], symbol: token_json['symbol'],
                            price: token_json['price'])
    end
    cryptocurrency
  end
end
