class AddArbitrageAmountAndArbitrageProfitToSwapPaths < ActiveRecord::Migration[6.1]
  def change
    add_column :swap_paths, :arbitrage_amount, :decimal, precision: 40
    add_column :swap_paths, :arbitrage_profit, :decimal, precision: 15, scale: 2
  end
end
