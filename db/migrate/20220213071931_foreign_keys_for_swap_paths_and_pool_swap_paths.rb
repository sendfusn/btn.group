class ForeignKeysForSwapPathsAndPoolSwapPaths < ActiveRecord::Migration[6.1]
  def change
    add_foreign_key "pool_swap_paths", "pools", name: "pool_swap_paths_pool_id_fk"
    add_foreign_key "pool_swap_paths", "swap_paths", name: "pool_swap_paths_swap_path_id_fk"
    add_foreign_key "swap_paths", "protocols", name: "swap_paths_protocol_id_fk"
  end
end
