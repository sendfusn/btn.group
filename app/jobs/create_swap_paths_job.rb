# frozen_string_literal: true

class CreateSwapPathsJob < ApplicationJob
  def perform
    cryptocurrency_ids = Pool.enabled
                             .trade_pair
                             .joins(:cryptocurrency_pools)
                             .where(cryptocurrency_pools: { cryptocurrency_role: :deposit })
                             .pluck(:cryptocurrency_id)
                             .uniq
    cryptocurrency_ids.each do |from_id|
      run_time = Time.zone.now + rand(60).minutes
      CreateSwapPathsForCryptoJob.set(wait_until: run_time).perform_later(from_id)
    end
  end
end
