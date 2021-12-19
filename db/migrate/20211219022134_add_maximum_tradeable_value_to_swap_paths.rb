class AddMaximumTradeableValueToSwapPaths < ActiveRecord::Migration[6.1]
  def change
    add_column :swap_paths, :maximum_tradeable_value, :decimal, precision: 15, scale: 2
  end
end
