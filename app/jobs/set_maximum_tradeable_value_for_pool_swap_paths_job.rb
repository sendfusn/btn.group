# frozen_string_literal: true

class SetMaximumTradeableValueForPoolSwapPathsJob < ApplicationJob
  def perform(pool_id, pool_swap_path_id)
    psp = PoolSwapPath.where(pool_id: pool_id).where('id > ?', pool_swap_path_id).order(:id).first
    return if psp.nil?
    return if psp.swap_path.nil?

    mtv = psp.swap_path.pools.order(:total_locked).first.total_locked
    psp.swap_path.update(maximum_tradeable_value: mtv)
    SetMaximumTradeableValueForPoolSwapPathsJob.perform_later(pool_id, psp.id)
  end
end
