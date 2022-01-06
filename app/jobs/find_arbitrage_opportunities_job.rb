# frozen_string_literal: true

class FindArbitrageOpportunitiesJob < ApplicationJob
  def perform(cryptocurrency_id)
    c = Cryptocurrency.find(cryptocurrency_id)
    return if c.currently_finding_arbitrage_opportunities

    c.update!(currently_finding_arbitrage_opportunities: true)
    SwapPath.where(from_id: cryptocurrency_id, to_id: cryptocurrency_id)
            .where('maximum_tradeable_value > ?', 50)
            .each(&:set_optimal_arbitrage_details)
    c.update!(currently_finding_arbitrage_opportunities: false)
  end
end
