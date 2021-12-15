class AddKeys < ActiveRecord::Migration[6.1]
  def change
    add_foreign_key "cryptocurrencies", "blockchains", name: "cryptocurrencies_blockchain_id_fk"
    add_foreign_key "pools", "pools", name: "pools_pool_id_fk"
    add_foreign_key "swap_paths", "cryptocurrencies", column: "from_id", name: "swap_paths_from_id_fk"
    add_foreign_key "swap_paths", "cryptocurrencies", column: "to_id", name: "swap_paths_to_id_fk"
  end
end
