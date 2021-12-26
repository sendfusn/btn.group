# frozen_string_literal: true

class SaveSwapPathJob < ApplicationJob
  def perform(swap_path_id)
    swap_path = SwapPath.where('id > ?', swap_path_id).order(:id).first
    return unless swap_path

    swap_path.save!
    CreatePoolSwapPathsForSwapPathJob.perform_later(swap_path.id)
  end
end
