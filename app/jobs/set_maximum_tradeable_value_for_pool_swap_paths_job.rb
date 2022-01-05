# frozen_string_literal: true

class SetMaximumTradeableValueForPoolSwapPathsJob < ApplicationJob
  def perform(pool_id, pool_swap_path_id)
    psp = PoolSwapPath.where(pool_id: pool_id).where('id > ?', pool_swap_path_id).order(:id).first
    return if psp.nil?

    SetMaximumTradeableValueForPoolSwapPathsJob.perform_later(pool_id, psp.id)
    if (swap_path = psp.swap_path)
      mtv = swap_path.pools.order(:total_locked).first.total_locked
      swap_path.update(maximum_tradeable_value: mtv) if mtv != swap_path.maximum_tradeable_value
    else
      psp.destroy
    end
  end
end
