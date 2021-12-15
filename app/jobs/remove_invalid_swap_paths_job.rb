# frozen_string_literal: true

class RemoveInvalidSwapPathsJob < ApplicationJob
  def perform
    SwapPath.all.each do |swap_path|
      swap_path.swap_path_as_array.each do |pool_id|
        pool = Pool.find_by(pool_id.to_i)
        if pool.nil? || !pool.enabled
          swap_path.destroy
          break
        end
      end
    end
  end
end
