# frozen_string_literal: true

class CreateSwapPathsJob < ApplicationJob
  def perform
    valid_pools_joined_with_cryptocurrency_pools = Pool.enabled
                                                       .trade_pair
                                                       .joins(:cryptocurrency_pools)
    cryptocurrency_ids = valid_pools_joined_with_cryptocurrency_pools.pluck(:cryptocurrency_id)
                                                                     .uniq
    cryptocurrency_ids.each do |from_id|
      CreateSwapPathsForFromIdJob.perform_later(from_id)
    end
  end
end
