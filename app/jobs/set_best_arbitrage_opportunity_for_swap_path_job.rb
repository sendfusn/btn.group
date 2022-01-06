# frozen_string_literal: true

class SetBestArbitrageOpportunityForSwapPathJob < ApplicationJob
  def perform(swap_path_id)
    SwapPath.find(swap_path_id).set_optimal_arbitrage_details
  end
end
