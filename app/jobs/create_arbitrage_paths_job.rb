# frozen_string_literal: true

class CreateArbitragePathsJob < ApplicationJob
  def perform(symbol)
    return unless (ci = Cryptocurrency.find_by(symbol: symbol.upcase, official: true)&.id)

    swap_path = []
    create_swap_path(ci, ci, swap_path)
  end

  def create_swap_path(current_cryptocurrency_id, from_id, swap_path)
    return if swap_path.length >= 4

    trade_pair_pool_ids = Pool.enabled
                              .trade_pair
                              .joins(:cryptocurrency_pools)
                              .where(cryptocurrency_pools: { cryptocurrency_role: :deposit, cryptocurrency_id: current_cryptocurrency_id })
                              .where.not(cryptocurrency_pools: { amount: '0' })
                              .pluck(:id)
                              .uniq
    trade_pair_pool_ids.each do |pool_id|
      next if swap_path.last == pool_id

      current_swap_path = swap_path.dup
      current_swap_path.push(pool_id)
      swap_to_id = Pool.find(pool_id)
                       .cryptocurrency_pools
                       .deposit
                       .where.not(cryptocurrency_id: current_cryptocurrency_id)
                       .first
                       .cryptocurrency_id
      if from_id == swap_to_id
        SwapPath.create(from_id: from_id,
                        to_id: swap_to_id,
                        swap_count: current_swap_path.length,
                        swap_path_as_string: convert_swap_path_array_to_string(current_swap_path))
      else
        create_swap_path(swap_to_id, from_id, current_swap_path)
      end
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
