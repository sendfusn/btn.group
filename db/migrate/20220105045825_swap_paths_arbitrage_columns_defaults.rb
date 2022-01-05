class SwapPathsArbitrageColumnsDefaults < ActiveRecord::Migration[6.1]
  def change
    change_column :swap_paths, :arbitrage_amount, :decimal, precision: 40, default: 0
    change_column :swap_paths, :arbitrage_profit, :decimal, precision: 15, scale: 2, default: 0  
  end
end
