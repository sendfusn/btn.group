# frozen_string_literal: true

class RemoveInconsistentSwapPathsJob < ApplicationJob
  def perform
    swap_paths_to_process = true
    id = 0
    while swap_paths_to_process
      if (sp = SwapPath.where('id > ?', id).order(:id).first)
        id = sp.id
        sp.destroy! if sp.swap_count != sp.pool_swap_paths.count
      else
        swap_paths_to_process = false
      end
    end
  end
end
