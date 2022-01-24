# frozen_string_literal: true

class CreateSwapPathsJob < ApplicationJob
  def perform
    cryptocurrency_ids = Pool.enabled
                             .trade_pair
                             .joins(:cryptocurrency_pools)
                             .where(cryptocurrency_pools: { cryptocurrency_role: :deposit })
                             .pluck(:cryptocurrency_id)
                             .uniq
    cryptocurrency_ids.find_each do |from_id|
      CreateSwapPathsForCryptoJob.perform_later(from_id)
    end
  end
end
