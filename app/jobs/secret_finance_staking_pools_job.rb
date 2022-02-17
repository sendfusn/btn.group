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

    pool = Protocol.find_by(identifier: :secret_swap)
                   .pools
                   .find_or_initialize_by(smart_contract_id: pool_smart_contract.id, category: 'farm')
    locked_amount_in_usd = pool_json['total_locked'].to_i * pool_json['inc_token']['price'].to_f / 10**pool_json['inc_token']['decimals']
    pool.deadline = pool_json['deadline'].to_i
    pool.pending_rewards = pool_json['pending_rewards'].to_i
    pool.total_locked = locked_amount_in_usd
    if pool.persisted?
      pool.save!
    else
      incentivized_token_cryptocurrency = process_token_json(pool_json['inc_token'])
      reward_token_cryptocurrency = process_token_json(pool_json['rewards_token'])
      pool.pool_id = CryptocurrencyPool.shares.find_by(cryptocurrency: incentivized_token_cryptocurrency)&.pool&.id
      pool.save!
      pool.cryptocurrency_pools.create(cryptocurrency: incentivized_token_cryptocurrency, cryptocurrency_role: :deposit)
      pool.cryptocurrency_pools.create(cryptocurrency: reward_token_cryptocurrency, cryptocurrency_role: :reward)
    end
    # EthereumBridgeFrontend/blob/master/src/components/Earn/EarnRow/index.tsx
    price_of_rewards = pool_json['rewards_token']['price'].to_f
    pending_rewards_in_usd = pool.pending_rewards * price_of_rewards / 1_000_000
    return unless locked_amount_in_usd.positive?

    time_remaining_in_seconds = (pool.deadline - 128_730) * 6.22 + 1_632_380_505 - Time.zone.now.to_i
    apr = pending_rewards_in_usd * 100 * 31_540_000 / locked_amount_in_usd / time_remaining_in_seconds
    if apr.positive?
      pool.update(apr: apr.round(2))
      Pool.where(pool: pool).find_each do |yield_optimizer|
        yield_optimizer.update(apy: ((((1 + apr / 100 / 365)**365) - 1) * 100).round(2))
      end
    else
      pool.update(apr: 0)
      Pool.where(pool: pool).find_each do |yield_optimizer|
        yield_optimizer.update(apy: 0)
      end
    end
  end

  def process_token_json(token_json)
    smart_contract = SmartContract.find_by(address: token_json['address'].downcase)
    return unless smart_contract

    cryptocurrency = Cryptocurrency.find_or_initialize_by(smart_contract: smart_contract)
    unless cryptocurrency.persisted?
      cryptocurrency.update(decimals: token_json['decimals'], name: token_json['name'], symbol: token_json['symbol'],
                            price: token_json['price'], blockchain: Blockchain.find_by(identifier: 'secret_network'))
    end
    cryptocurrency
  end
end
