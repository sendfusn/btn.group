class RemoveAllArbitrageColumns < ActiveRecord::Migration[6.1]
  def change
    remove_column :cryptocurrencies, :arbitrage
    remove_column :swap_paths, :arbitrage_amount
    remove_column :swap_paths, :arbitrage_profit
  end
end
