# frozen_string_literal: true

class RemoveInvalidSwapPathsJob < ApplicationJob
  after_perform do |_job|
    run_time = Time.zone.now + 55.minutes
    RemoveInvalidSwapPathsJob.set(wait_until: run_time).perform_later unless RemoveInvalidSwapPathsJob.scheduled?
  end

  def perform
    SwapPath.all.each do |swap_path|
      swap_path.split(',').each do |pool_id|
        pool = Pool.find_by(pool_id.to_i)
        if pool.nil? || !pool.enabled
          swap_path.destroy
          break
        end
      end
    end
  end
end
