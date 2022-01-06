class RemoveColumnCurrentlyFindingArbitrageOpportunitiesFromCryptocurrencies < ActiveRecord::Migration[6.1]
  def change
    remove_column :cryptocurrencies, :currently_finding_arbitrage_opportunities
  end
end
