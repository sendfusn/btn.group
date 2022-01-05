class AddCurrentlyFindingArbitrageOpportunitiesToCryptocurrencies < ActiveRecord::Migration[6.1]
  def change
    add_column :cryptocurrencies, :currently_finding_arbitrage_opportunities, :boolean
  end
end
