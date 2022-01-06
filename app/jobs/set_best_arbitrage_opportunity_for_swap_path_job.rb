# frozen_string_literal: true

class SetBestArbitrageOpportunityForSwapPathJob < ApplicationJob
  def perform(swap_path_id)
    sp = SwapPath.find(swap_path_id)
    return if sp.updated_at > Time.current - 30.minutes

    sp.set_optimal_arbitrage_details
  end
end
