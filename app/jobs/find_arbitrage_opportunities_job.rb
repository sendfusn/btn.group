# frozen_string_literal: true

class FindArbitrageOpportunitiesJob < ApplicationJob
  def perform(cryptocurrency_id)
    c = Cryptocurrency.find(cryptocurrency_id)
    swap_paths = SwapPath.where(from_id: cryptocurrency_id, to_id: cryptocurrency_id)
    return if swap_paths.blank?

    c_ten_dollars_amount = 10 / c.price * 10**c.decimals
    current_amount = c_ten_dollars_amount
    current_amount_as_usd = c.amount_as_usd(current_amount)
    largest_maximum_tradeable_value = swap_paths.order(:maximum_tradeable_value).last.maximum_tradeable_value
    swap_paths.each { |sp| sp.update!(arbitrage_amount: 0, arbitrage_profit: 0) }
    while current_amount_as_usd < largest_maximum_tradeable_value
      swap_paths.where('maximum_tradeable_value < ?', current_amount_as_usd)
                .each do |sp|
                  net_result_as_usd = sp.net_result_as_usd(sp.simulate_swaps(current_amount))
                  net_profit = net_result_as_usd - current_amount_as_usd
                  sp.update(arbitrage_amount: current_amount, arbitrage_profit: net_profit) if net_profit > sp.arbitrage_profit
                end
      current_amount += c_ten_dollars_amount
      current_amount_as_usd = c.amount_as_usd(current_amount)
    end
  end
end
