# frozen_string_literal: true

class CreateSwapPathsForFromIdJob < ApplicationJob
  def perform(from_id)
    swap_path = []
    create_swap_path(from_id, from_id, swap_path)
  end

  def create_swap_path(current_cryptocurrency_id, from_id, swap_path)
    return if swap_path.length > 4

    valid_pools_joined_with_cryptocurrency_pools = Pool.enabled
                                                       .trade_pair
                                                       .joins(:cryptocurrency_pools)
    trade_pair_pool_ids = valid_pools_joined_with_cryptocurrency_pools.where(cryptocurrency_pools: { cryptocurrency_role: :deposit, cryptocurrency_id: current_cryptocurrency_id }).pluck(:id)
    trade_pair_pool_ids.each do |pool_id|
      next if swap_path.include?(pool_id)

      current_swap_path = swap_path.dup
      current_swap_path.push(pool_id)
      swap_to_id = Pool.find(pool_id)
                       .cryptocurrency_pools
                       .deposit
                       .where.not(cryptocurrency_id: current_cryptocurrency_id)
                       .first
                       .cryptocurrency_id
      next if from_id == swap_to_id

      SwapPath.create(from_id: from_id,
                      to_id: swap_to_id,
                      swap_count: current_swap_path.length,
                      swap_path_as_string: convert_swap_path_array_to_string(current_swap_path))
      create_swap_path(swap_to_id, from_id, current_swap_path)
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
