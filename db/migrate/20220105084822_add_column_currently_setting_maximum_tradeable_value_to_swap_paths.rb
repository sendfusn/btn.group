class AddColumnCurrentlySettingMaximumTradeableValueToSwapPaths < ActiveRecord::Migration[6.1]
  def change
    add_column :swap_paths, :next_swap_path_to_set_maximum_tradeable_value_to, :integer
  end
end
