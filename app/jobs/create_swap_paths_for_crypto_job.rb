# frozen_string_literal: true

class CreateSwapPathsForCryptoJob < ApplicationJob
  def perform(id)
    return if Cryptocurrency.find(id).smart_contract_id.nil?

    crypto_id_path = [id]
    swap_path = []
    create_swap_path(id, id, swap_path, crypto_id_path)
  end

  def create_swap_path(current_cryptocurrency_id, from_id, swap_path, crypto_id_path)
    return if swap_path.length >= 4

    trade_pair_pool_ids = Pool.enabled
                              .trade_pair
                              .joins(:cryptocurrency_pools)
                              .where(cryptocurrency_pools: { cryptocurrency_role: :deposit, cryptocurrency_id: current_cryptocurrency_id })
                              .pluck(:id)
                              .uniq

    trade_pair_pool_ids.each do |pool_id|
      next if swap_path.include?(pool_id)

      current_crypto_id_path = crypto_id_path.dup
      current_swap_path = swap_path.dup
      current_swap_path.push(pool_id)
      swap_to_id = Pool.find(pool_id)
                       .cryptocurrency_pools
                       .deposit
                       .where.not(cryptocurrency_id: current_cryptocurrency_id)
                       .first
                       .cryptocurrency_id
      next if from_id == swap_to_id
      next if Cryptocurrency.find(swap_to_id).smart_contract_id.nil?
      next if current_crypto_id_path.include?(swap_to_id)

      current_crypto_id_path.push(swap_to_id)
      SwapPath.create(from_id: from_id,
                      to_id: swap_to_id,
                      swap_count: current_swap_path.length,
                      swap_path_as_string: convert_swap_path_array_to_string(current_swap_path))
      create_swap_path(swap_to_id, from_id, current_swap_path, current_crypto_id_path)
    end
  end

  def convert_swap_path_array_to_string(swap_path)
    string = ''
    swap_path.each_with_index do |id, index|
      string = "#{string}," unless index.zero?
      string = "#{string}#{id}"
    end
    string
  end
end
