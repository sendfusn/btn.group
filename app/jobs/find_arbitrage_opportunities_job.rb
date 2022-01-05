# frozen_string_literal: true

class FindArbitrageOpportunitiesJob < ApplicationJob
  def perform(cryptocurrency_id)
    c = Cryptocurrency.find(cryptocurrency_id)
    return if c.currently_finding_arbitrage_opportunities

    c.update!(currently_finding_arbitrage_opportunities: true)
    swap_paths = SwapPath.where(from_id: cryptocurrency_id, to_id: cryptocurrency_id)
    return if swap_paths.blank?

    c_ten_dollars_amount = 10 / c.price * 10**c.decimals
    swap_paths.each do |sp|
      current_amount = c_ten_dollars_amount
      current_amount_as_usd = c.amount_as_usd(current_amount)
      arbitrage_amount = 0
      arbitrage_profit = -555
      while sp.maximum_tradeable_value > current_amount_as_usd
        net_result_as_usd = sp.net_result_as_usd(sp.simulate_swaps(current_amount))
        net_profit = net_result_as_usd - current_amount_as_usd
        if net_profit > arbitrage_profit
          arbitrage_amount = current_amount
          arbitrage_profit = net_profit
        end
        current_amount += c_ten_dollars_amount
        current_amount_as_usd = c.amount_as_usd(current_amount)
      end
      sp.update!(arbitrage_amount: arbitrage_amount, arbitrage_profit: arbitrage_profit)
    end
    c.update!(currently_finding_arbitrage_opportunities: false)
  end
end
