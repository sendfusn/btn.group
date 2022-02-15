# frozen_string_literal: true

# This can be refactored into pool with a callback...
# The other thing is that it should be based on the LP tokens inside of the farm contract
# Also needs to be refactored so that it factors in the end date...

require 'rest-client'

class CalculateAprForYieldOptimizerBJob < ApplicationJob
  after_perform do |_job|
    run_time = Time.zone.now + 1.hour
    CalculateAprForYieldOptimizerBJob.set(wait_until: run_time).perform_later unless CalculateAprForYieldOptimizerBJob.scheduled?
  end

  def perform
    button_address = 'secret1yxcexylwyxlq58umhgsjgstgcg2a0ytfy4d9lt'
    swbtc_address = 'secret1g7jfnxmxkjgqdts9wlmn238mrzxz5r92zwqv4a'
    response = RestClient.get 'https://api-bridge-mainnet.azurewebsites.net/secretswap_pools', { params: { page: 0, size: 1000 } }
    staking_pools = JSON.parse(response.body)['pools']
    staking_pools.each do |staking_pool|
      asset_one = staking_pool['assets'][0]
      asset_two = staking_pool['assets'][1]
      next if asset_one['info']['token'].blank?
      next if asset_two['info']['token'].blank?

      token_addresses = [asset_one['info']['token']['contract_addr'], asset_two['info']['token']['contract_addr']]
      next unless token_addresses.include?(button_address)
      next unless token_addresses.include?(swbtc_address)

      asset_one_amount = asset_one['amount']
      asset_two_amount = asset_two['amount']
      buttcoin_amount = if asset_one['info']['token']['contract_addr'] == button_address
        asset_one_amount.to_i
      else
        asset_two_amount.to_i
      end
      buttcoin_released_per_day = 19_200_000_000
      pool = Pool.find_or_initialize_by(protocol: Protocol.find_by(identifier: 'btn_group'), smart_contract: SmartContract.find_by(address: 'secret1725s6smzds6h89djq9yqrtlqfepnxruc3m4fku'))
      pool.update!(apr: buttcoin_released_per_day * 365 * 100 / (buttcoin_amount * 2))
      break
    end
  end
end
