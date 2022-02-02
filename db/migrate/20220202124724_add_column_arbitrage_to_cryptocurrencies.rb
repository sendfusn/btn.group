class AddColumnArbitrageToCryptocurrencies < ActiveRecord::Migration[6.1]
  def change
    add_column :cryptocurrencies, :arbitrage, :boolean
  end
end
