# frozen_string_literal: true

class SetMaximumTradeableValueForPoolSwapPathsJob < ApplicationJob
  def perform(pool_id, pool_swap_path_id)
    pool = Pool.find(pool_id)
    return unless (psp = PoolSwapPath.where(pool_id: pool_id).where('id > ?', pool_swap_path_id).order(:id).first)

    pool.update!(next_swap_path_to_set_maximum_tradeable_value_to: psp.swap_path_id) if pool.next_swap_path_to_set_maximum_tradeable_value_to.nil?
    return if pool.next_swap_path_to_set_maximum_tradeable_value_to != psp.swap_path_id

    psp.swap_path.set_maximum_tradeable_value
    next_psp = PoolSwapPath.where(pool_id: pool_id).where('id > ?', psp.id).order(:id).first
    if next_psp.nil?
      pool.update(next_swap_path_to_set_maximum_tradeable_value_to: nil)
    else
      pool.update(next_swap_path_to_set_maximum_tradeable_value_to: next_psp.swap_path_id)
      SetMaximumTradeableValueForPoolSwapPathsJob.perform_later(pool_id, psp.id)
    end
  end
end
