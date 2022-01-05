class MoveCurrentlySettingMtvToPools < ActiveRecord::Migration[6.1]
  def change
    add_column :pools, :next_swap_path_to_set_maximum_tradeable_value_to, :integer
    remove_column :swap_paths, :next_swap_path_to_set_maximum_tradeable_value_to
  end
end
