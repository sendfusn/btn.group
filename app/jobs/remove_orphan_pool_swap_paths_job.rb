# frozen_string_literal: true

class RemoveOrphanPoolSwapPathsJob < ApplicationJob
  def perform
    pool_swap_paths_to_process = true
    id = 0
    while pool_swap_paths_to_process
      psp = PoolSwapPath.where('id > ?', id).order(:id).first
      if psp
        id = psp.id
        psp.destroy if psp.swap_path.nil?
      else
        pool_swap_paths_to_process = false
      end
    end
  end
end
