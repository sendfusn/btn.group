# frozen_string_literal: true

class SwapPathTestJob < ApplicationJob
  def perform(swap_path_id)
    swap_path = SwapPath.where('id > ?', swap_path_id).order(:id).first
    swap_path.swap_path_as_array.each_with_index do |pool_id, index|
      swap_path.pool_swap_paths.create(pool_id: pool_id, position: index)
    end
    SwapPathTestJob.perform_later(swap_path.id)
  end
end
