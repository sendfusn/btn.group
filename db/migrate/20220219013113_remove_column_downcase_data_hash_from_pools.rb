class RemoveColumnDowncaseDataHashFromPools < ActiveRecord::Migration[6.1]
  def change
    remove_column :pools, :downcase_data_hash_for_swap_simulation
  end
end
